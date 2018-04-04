import { Role } from '../../types/data/Identity'
import { ImprintingContract, OrchestrationContract } from './../../types/data/Contract'
import { BCPool, Options as PoolOptions, Pool } from './BcoinCEV/Pool'
import { base58AddrByPrivKey, Base58Address } from './BcoinID/HD'
import { BcoinCEV } from './types/BcoinCEV'
import { BcoinDB } from './types/BcoinDB'
import { BcoinID } from './types/BcoinID'
export interface Options {
  pool?: PoolOptions
}
const imprintingHDPath = [0, 0, 0, 0]

const waitForAddressBlock = async (pool: BCPool, address: Base58Address) =>
  new Promise((resolve, reject) => {
    // console.log('watching', address)
    pool.stopSync()
    pool.unwatch()
    pool.watchAddress(address)
    const listener = (block: any, entry: any) => {
      if (block.txs.length) {
        pool.removeListener('block', listener)
        resolve(block)
      }
    }
    pool.on('block', listener)
    pool.startSync()
    pool.sync(true)
  })

const loopReady = (db: BcoinDB, pool: BCPool) => () => ({})

const loopInit = async (db: BcoinDB, id: BcoinID, pool: BCPool) =>
  db
    .getImprinting()
    .then(async impr => {
      if (!impr) {
        const imprintingHDKey = id.derivePrivateKey(imprintingHDPath)
        const imprintingAddress = base58AddrByPrivKey(imprintingHDKey)
        // console.log('await impr')
        await waitForAddressBlock(pool, imprintingAddress)
        // console.log('--  impr')

        return db.storeImprinting({ imprinting: true } as ImprintingContract)
      }
    })
    .then(db.getOrchestration)
    .then(async orch => {
      if (!orch) {
        const orchestrationAddress = id.identityFor({ role: Role.Provider, index: 0 }).address
        // console.log('await orch')
        await waitForAddressBlock(pool, orchestrationAddress)
        // console.log('--- orch')

        return db.storeOrchestration({ orchestration: true } as OrchestrationContract)
      }
    })
    .then(loopReady(db, pool))

export const makeBcoinCEV = async (db: BcoinDB, id: BcoinID, opts?: Options): Promise<BcoinCEV> => {
  const defOpts: Options = {}
  opts = {
    ...opts,
    ...defOpts,
  }
  const pool = await Pool(opts.pool)

  return loopInit(db, id, pool).then(() => ({
    pool,
  }))
}
