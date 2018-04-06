import { ImprintingContract } from './../../types/data/Contract'
import { BCPool, Options as PoolOptions, Pool } from './BcoinCEV/Pool'
import { convertToImprintingContract, convertToOrchestrationContract } from './BcoinCEV/TX/txContracts'
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

const ensureImprinting = (db: BcoinDB, id: BcoinID, pool: BCPool) =>
  db.getImprinting().then(async shallBeImprintingContract => {
    console.log(`---------------------------------------------------------- IMPR `, shallBeImprintingContract)
    const imprintingHDKey = id.derivePrivateKey(imprintingHDPath)
    const imprintingAddress = base58AddrByPrivKey(imprintingHDKey)
    while (!shallBeImprintingContract) {
      const txs = await pool.watchAddresses([imprintingAddress])
      console.log(`---------------------------------------------------------- got IMPR ${imprintingAddress}`, txs)
      shallBeImprintingContract = await convertToImprintingContract(imprintingAddress, txs)
      if (shallBeImprintingContract) {
        await db.storeImprinting(shallBeImprintingContract)
      }
    }

    return shallBeImprintingContract
  })

const ensureOrchestration = (db: BcoinDB, id: BcoinID, pool: BCPool) => (imprintingContract: ImprintingContract) =>
  db.getOrchestration().then(async shallBeOrchestrationContract => {
    const orchestrationHDKey = id.derivePrivateKey(orchestrationHDPath)
    const orchestrationAddress = base58AddrByPrivKey(orchestrationHDKey)
    while (!shallBeOrchestrationContract) {
      console.log(`---------------------------------------------------------- ORCH `, shallBeOrchestrationContract)
      const txs = await pool.watchAddresses([orchestrationAddress])
      console.log(`---------------------------------------------------------- got ORCH ${orchestrationAddress}`, txs)
      shallBeOrchestrationContract = await convertToOrchestrationContract(imprintingContract, orchestrationAddress, txs)
      if (shallBeOrchestrationContract) {
        await db.storeOrchestration(shallBeOrchestrationContract)
      }
    }

    return shallBeOrchestrationContract
  })

const start = async (db: BcoinDB, id: BcoinID, pool: BCPool) =>
  ensureImprinting(db, id, pool).then(ensureOrchestration(db, id, pool)).then(loopReady(db, pool))

export const makeBcoinCEV = async (db: BcoinDB, id: BcoinID, opts?: Options): Promise<BcoinCEV> => {
  const defOpts: Options = {}
  opts = {
    ...opts,
    ...defOpts,
  }
  const pool = await Pool(opts.pool)

  return start(db, id, pool).then(() => ({
    pool,
  }))
}
