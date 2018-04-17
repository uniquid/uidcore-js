import { ImprintingContract } from './../../../types/data/Contract'
import { BCPool } from './../BcoinCEV/Pool'
import { BcoinDB } from './../types/BcoinDB'
import { BcoinID } from './../types/BcoinID'
import {
  convertToImprintingContract,
  convertToOrchestrationContract,
  getRevokingAddresses,
  getRoleContracts,
} from './TX/txContracts'

const loopRoleContractWatch = async (db: BcoinDB, pool: BCPool, id: BcoinID, watchahead: number) => {
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

  const watchingRevokingAddresses = db.getActiveRoleContracts().map(ctr => ctr.revoker)
  console.log(`watchingRevokingAddresses: `, watchingRevokingAddresses.reduce((s, a, i) => `${s}\n${i} : ${a}`, ''))
  console.log(`nextWatchAddresses: `, nextWatchAddresses.reduce((s, a, i) => `${s}\n${i} : ${a}`, ''))
  const txs = await pool.watchAddresses(nextWatchAddresses.concat(watchingRevokingAddresses))
  const newContracts = getRoleContracts(nextWatchIdentities)(txs)
  console.log(`\nNEW Role Contracts: ${newContracts.length} `)
  console.log(newContracts.reduce((s, c) => `${s}${c.identity.role}[${c.identity.index}] -> ${c.contractor}\n`, ''))
  newContracts.forEach(db.storeCtr)
  const revokingAddresses = getRevokingAddresses(watchingRevokingAddresses)(txs)
  console.log(`\nREVOKING Addresses: ${revokingAddresses.length}`)
  console.log(revokingAddresses.reduce((s, a) => `${s}${a}\n`, ''))
  revokingAddresses.forEach(db.revokeContract)
  loopRoleContractWatch(db, pool, id, watchahead).catch(err => console.error('loopRoleContractWatch ERROR:', err))
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
      db.revokeContract(imprintingContract.revoker)
    }
  }

  return shallBeOrchestrationContract
}

export const startContractManager = async (db: BcoinDB, id: BcoinID, pool: BCPool, watchahead: number) =>
  ensureImprinting(db, id, pool)
    .then(ensureOrchestration(db, id, pool))
    .then(() => loopRoleContractWatch(db, pool, id, watchahead))
