import { Role } from '../../types/data/Identity'
import { ImprintingContract, OrchestrationContract } from './../../types/data/Contract'
import { BCPool, Options as PoolOptions, Pool } from './BcoreCEV/Pool'
import { base58AddrByPrivKey, Base58Address } from './BcoreID/HD'
import { BcoreCEV } from './types/BcoreCEV'
import { BcoreDB } from './types/BcoreDB'
import { BcoreID } from './types/BcoreID'
export interface Options {
  pool?: PoolOptions
}
const imprintingHDPath = [0, 0, 0, 0]

const waitForAddressBlock = async (pool: BCPool, address: Base58Address) =>
  new Promise((resolve, reject) => {
    console.log('watching', address)
    pool.stopSync()
    pool.unwatch()
    pool.watchAddress(address)
    const listener = (block: any, entry: any) => {
      // console.log('..block')
      if (block.txs.length) {
        console.log('\n\n\n\nreceived BLOCK', block)
        pool.removeListener('block', listener)
        resolve(block)
      }
    }
    pool.on('block', listener)
    pool.startSync()
    pool.sync(true)
  })

const loopReady = (db: BcoreDB, pool: BCPool) => () => ({})

const loopInit = async (db: BcoreDB, id: BcoreID, pool: BCPool) =>
  /*const imprintingPromise = */
  db
    .getImprinting()
    .then(async impr => {
      if (!impr) {
        const imprintingHDKey = id.derivePrivateKey(imprintingHDPath)
        const imprintingAddress = base58AddrByPrivKey(imprintingHDKey)
        console.log('await impr')
        await waitForAddressBlock(pool, imprintingAddress)
        console.log('--  impr')

        return db.storeImprinting({ imprinting: true } as ImprintingContract)
      }
    })
    .then(db.getOrchestration)
    .then(async orch => {
      if (!orch) {
        const orchestrationAddress = id.identityFor({ role: Role.Provider, index: 0 }).address
        console.log('await orch')
        await waitForAddressBlock(pool, orchestrationAddress)
        console.log('--- orch')

        return db.storeOrchestration({ orchestration: true } as OrchestrationContract)
      }
    })
    .then(loopReady(db, pool))

const defOpts: Options = {}
export const makeBcoreCEV = async (db: BcoreDB, id: BcoreID, opts?: Options): Promise<BcoreCEV> => {
  opts = {
    ...opts,
    ...defOpts,
  }
  const pool = await Pool(opts.pool)

  return loopInit(db, id, pool).then(() => ({}))

  // const imprintingHDKey = id.derivePrivateKey(imprintingHDPath)
  // const imprintingAddress = base58AddrByPrivKey(imprintingHDKey)

  // const orchestrationAddress = id.identityFor({ role: Role.Provider, index: 0 }).address
  // console.log(imprintingAddress, orchestrationAddress)
  // pool.watchAddress(orchestrationAddress)
  // pool.watchAddress(imprintingAddress)
  // pool.on('block', (block: any, entry: any) => {
  //   // console.log('..block')
  //   if (block.txs.length) {
  //     console.log('\n\n\n\nreceived BLOCK', block)
  //   }
  // })

  // pool.on('tx', (block: any, entry: any) => {
  //   console.log('TX', block, entry)
  // })
}
