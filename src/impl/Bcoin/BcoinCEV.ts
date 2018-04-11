import * as path from 'path'
import { ImprintingContract } from './../../types/data/Contract'
import { BCPool, Pool } from './BcoinCEV/Pool'
import {
  convertToImprintingContract,
  convertToOrchestrationContract,
  convertToRoleContract,
  getChangeAddress,
  getUserAddress,
  isContractTX,
} from './BcoinCEV/TX/txContracts'
import { BcoinCEV } from './types/BcoinCEV'
import { BcoinDB } from './types/BcoinDB'
import { BcoinID } from './types/BcoinID'

const loopReady = (db: BcoinDB, pool: BCPool, id: BcoinID) => (): void => {
  const [providerIdentities, userIdentities] = [
    db.getLastProviderContractIdentity(),
    db.getLastUserContractIdentity(),
  ].map(lastIdentity =>
    [
      // tslint:disable-next-line:no-magic-numbers
      { ...lastIdentity, index: lastIdentity.index + 1 },
      // tslint:disable-next-line:no-magic-numbers
      { ...lastIdentity, index: lastIdentity.index + 2 },
      // tslint:disable-next-line:no-magic-numbers
      { ...lastIdentity, index: lastIdentity.index + 3 },
      // tslint:disable-next-line:no-magic-numbers
      { ...lastIdentity, index: lastIdentity.index + 4 },
      // tslint:disable-next-line:no-magic-numbers
      { ...lastIdentity, index: lastIdentity.index + 5 },
    ].map(id.identityFor)
  )

  const [providerAddresses, userAddresses] = [providerIdentities, userIdentities].map(identities =>
    identities.map(identity => identity.address)
  )

  const nextWatchaddresses = providerAddresses.concat(userAddresses)
  pool
    .watchAddresses(nextWatchaddresses)
    .then(txs => {
      txs.filter(isContractTX).forEach(tx => {
        const txProviderAddress = getChangeAddress(tx)
        const txUserAddress = getUserAddress(tx)
        const providerIndex = providerAddresses.indexOf(txProviderAddress)
        const userIndex = userAddresses.indexOf(txUserAddress)
        if (providerIndex > -1) {
          const providerCtr = convertToRoleContract(providerIdentities[providerIndex], tx)
          db.storeCtr(providerCtr).catch(error => console.error('LoopReady storeCtr providerCtr Error', error))
        }
        if (userIndex > -1) {
          const userCtr = convertToRoleContract(userIdentities[userIndex], tx)
          db.storeCtr(userCtr).catch(error => console.error('LoopReady storeCtr userCtr Error', error))
        }
      })
      loopReady(db, pool, id)()
    })
    .catch(error => console.error('LoopReady Error', error))
}

const ensureImprinting = (db: BcoinDB, id: BcoinID, pool: BCPool) =>
  db.getImprinting().then(async shallBeImprintingContract => {
    console.log(`---------------------------------------------------------- IMPR `, shallBeImprintingContract)
    const imprintingAddress = id.getImprintingAddress()
    while (!shallBeImprintingContract) {
      const txs = await pool.watchAddresses([imprintingAddress])
      console.log(`---------------------------------------------------------- got IMPR ${imprintingAddress}`, txs)
      shallBeImprintingContract = convertToImprintingContract(imprintingAddress, txs)
      if (shallBeImprintingContract) {
        await db.storeImprinting(shallBeImprintingContract)
      }
    }

    return shallBeImprintingContract
  })

const ensureOrchestration = (db: BcoinDB, id: BcoinID, pool: BCPool) => (imprintingContract: ImprintingContract) =>
  db.getOrchestration().then(async shallBeOrchestrationContract => {
    const orchestrationAddress = id.getOrchestrateAddress()
    while (!shallBeOrchestrationContract) {
      console.log(`---------------------------------------------------------- ORCH `, shallBeOrchestrationContract)
      const txs = await pool.watchAddresses([orchestrationAddress])
      console.log(`---------------------------------------------------------- got ORCH ${orchestrationAddress}`, txs)
      shallBeOrchestrationContract = convertToOrchestrationContract(imprintingContract, orchestrationAddress, txs)
      if (shallBeOrchestrationContract) {
        await db.storeOrchestration(shallBeOrchestrationContract)
      }
    }

    return shallBeOrchestrationContract
  })

const start = async (db: BcoinDB, id: BcoinID, pool: BCPool) =>
  ensureImprinting(db, id, pool).then(ensureOrchestration(db, id, pool)).then(loopReady(db, pool, id))
export interface Options {
  home: string
  logLevel: 'error' | 'warning' | 'info' | 'debug' | 'spam'
  seeds: string[]
}
export const makeBcoinCEV = async (db: BcoinDB, id: BcoinID, opts: Options): Promise<BcoinCEV> => {
  const pool = await Pool({
    dbFolder: path.join(opts.home, 'chain.db'),
    logLevel: opts.logLevel,
    seeds: opts.seeds,
  })

  return start(db, id, pool).then(() => ({
    pool,
  }))
}
