import * as path from 'path'
import { startContractManager } from './BcoinCEV/CtrManager'
import { Pool } from './BcoinCEV/Pool'

import { BcoinCEV } from './types/BcoinCEV'
import { BcoinDB } from './types/BcoinDB'
import { BcoinID } from './types/BcoinID'

export interface Options {
  home: string
  logLevel: 'error' | 'warning' | 'info' | 'debug' | 'spam'
  seeds: string[]
  watchahead: number
}
export const makeBcoinCEV = async (db: BcoinDB, id: BcoinID, opts: Options): Promise<BcoinCEV> => {
  const pool = await Pool({
    dbFolder: path.join(opts.home, 'chain.db'),
    logLevel: opts.logLevel,
    seeds: opts.seeds,
  })

  return startContractManager(db, id, pool, opts.watchahead).then(() => ({ pool }))
}
