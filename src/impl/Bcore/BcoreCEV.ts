import { BCPool, Options as PoolOptions, Pool } from './BcoreCEV/Pool'
import { BcoreCEV } from './types/BcoreCEV'
import { BcoreDB } from './types/BcoreDB'
import { BcoreID } from './types/BcoreID'
export interface Options {
  pool?: PoolOptions
}
const defOpts: Options = {}
export const makeBcoreCEV = async (db: BcoreDB, id: BcoreID, opts?: Options): Promise<BcoreCEV> => {
  opts = {
    ...opts,
    ...defOpts,
  }
  const pool = await Pool(opts.pool)
  loopInit(db, pool)

  return {}
}

const loopInit = async (db: BcoreDB, pool: BCPool) => {
  db
    .getImprinting()
    .then(async impr => {
      if (!impr) {
        // await pool waitImprinting
      }

      return db.getOrchestration()
    })
    .then(async orch => {
      if (!orch) {
        // await pool waitOrchestration
      }
      await db.invalidateImprinting()
    })
    .then(loopReady(db, pool))
}

const loopReady = (db: BcoreDB, pool: BCPool) => () => {}
