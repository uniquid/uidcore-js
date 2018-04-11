import { ImprintingContract } from './../../../types/data/Contract'
import { BCPool } from './../BcoinCEV/Pool'
import {
  convertToImprintingContract,
  convertToOrchestrationContract,
  getRoleContracts,
} from './../BcoinCEV/TX/txContracts'
import { BcoinDB } from './../types/BcoinDB'
import { BcoinID } from './../types/BcoinID'

const loopRoleContractWatch = (db: BcoinDB, pool: BCPool, id: BcoinID, watchahead: number) => {
  const nextWatchIdentities = [db.getLastProviderContractIdentity(), db.getLastUserContractIdentity()]
    .map(lastIdentity => {
      const identities = []
      for (let offset = 1; offset <= watchahead; offset++) {
        const waIdentity = id.identityFor({ ...lastIdentity, index: lastIdentity.index + offset })
        identities.push(waIdentity)
      }

      return identities
    })
    .reduce((a, b) => a.concat(b))

  const nextWatchAddresses = nextWatchIdentities.map(identity => identity.address)

  pool
    .watchAddresses(nextWatchAddresses)
    .then(getRoleContracts(nextWatchIdentities))
    .then(contracts => contracts.forEach(db.storeCtr))
    .then(() => loopRoleContractWatch(db, pool, id, watchahead))
    .catch(error => console.error('LoopReady Error', error))
}

const ensureImprinting = async (db: BcoinDB, id: BcoinID, pool: BCPool) => {
  let shallBeImprintingContract = db.getImprinting()
  console.log(`---------------------------------------------------------- IMPR `, shallBeImprintingContract)
  const imprintingAddress = id.getImprintingAddress()
  while (!shallBeImprintingContract) {
    const txs = await pool.watchAddresses([imprintingAddress])
    console.log(`---------------------------------------------------------- got IMPR ${imprintingAddress}`, txs)
    shallBeImprintingContract = convertToImprintingContract(imprintingAddress, txs)
    if (shallBeImprintingContract) {
      db.storeImprinting(shallBeImprintingContract)
    }
  }

  return shallBeImprintingContract
}

const ensureOrchestration = (db: BcoinDB, id: BcoinID, pool: BCPool) => async (
  imprintingContract: ImprintingContract
) => {
  let shallBeOrchestrationContract = db.getOrchestration()
  const orchestrationAddress = id.getOrchestrateAddress()
  while (!shallBeOrchestrationContract) {
    console.log(`---------------------------------------------------------- ORCH `, shallBeOrchestrationContract)
    const txs = await pool.watchAddresses([orchestrationAddress])
    console.log(`---------------------------------------------------------- got ORCH ${orchestrationAddress}`, txs)
    shallBeOrchestrationContract = convertToOrchestrationContract(imprintingContract, orchestrationAddress, txs)
    if (shallBeOrchestrationContract) {
      db.storeOrchestration(shallBeOrchestrationContract)
    }
  }

  return shallBeOrchestrationContract
}

export const startContractManager = async (db: BcoinDB, id: BcoinID, pool: BCPool, watchahead: number) =>
  ensureImprinting(db, id, pool)
    .then(ensureOrchestration(db, id, pool))
    .then(() => loopRoleContractWatch(db, pool, id, watchahead))
