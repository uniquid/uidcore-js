import { ImprintingContract, OrchestrationContract } from './../../types/data/Contract'
import { BCPool, Options as PoolOptions, Pool } from './BcoinCEV/Pool'
import { base58AddrByPrivKey } from './BcoinID/HD'
import { BcoinCEV } from './types/BcoinCEV'
import { BcoinDB } from './types/BcoinDB'
import { BcoinID } from './types/BcoinID'
export interface Options {
  pool?: PoolOptions
}
const imprintingHDPath = [0, 0, 0]
const orchestrationHDPath = [0, 1, 0]

const loopReady = (db: BcoinDB, pool: BCPool) => () => ({})

const loopInit = async (db: BcoinDB, id: BcoinID, pool: BCPool) =>
  db
    .getImprinting()
    .then(async impr => {
      console.log(`---------------------------------------------------------- FOUND IMPR`, impr)
      if (!impr) {
        const imprintingHDKey = id.derivePrivateKey(imprintingHDPath)
        const imprintingAddress = base58AddrByPrivKey(imprintingHDKey)
        console.log(`---------------------------------------------------------- await IMPR ${imprintingAddress}`)
        const block = await pool.waitForAddressBlock(imprintingAddress)
        console.log(`---------------------------------------------------------- got IMPR ${imprintingAddress}`, block)

        return db.storeImprinting({ imprinting: true } as ImprintingContract)
      }
    })
    .then(db.getOrchestration)
    .then(async orch => {
      console.log(`---------------------------------------------------------- FOUND ORCH`, orch)
      if (!orch) {
        const orchestrationHDKey = id.derivePrivateKey(orchestrationHDPath)
        const orchestrationAddress = base58AddrByPrivKey(orchestrationHDKey)
        console.log(`---------------------------------------------------------- await ORCH ${orchestrationAddress}`)
        const block = await pool.waitForAddressBlock(orchestrationAddress)
        console.log(
          `---------------------------------------------------------- got ORCH ${orchestrationAddress}`,
          block
        )

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
