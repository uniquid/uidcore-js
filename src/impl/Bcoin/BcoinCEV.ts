import * as path from 'path'
import { CEV } from '../../types/layers/CEV'
import { startContractManager } from './BcoinCEV/CtrManager'
import { Pool } from './BcoinCEV/Pool'
import { BcoinDB } from './types/BcoinDB'
import { BcoinID } from './types/BcoinID'

export interface Options {
  home: string
  logLevel: 'error' | 'warning' | 'info' | 'debug' | 'spam'
  seeds: string[]
  watchahead: number
}
export const makeBcoinCEV = (db: BcoinDB, id: BcoinID, opts: Options): CEV => {
  Pool({ dbFolder: path.join(opts.home, 'chain.db'), logLevel: opts.logLevel, seeds: opts.seeds })
    .then(pool => startContractManager(db, id, pool, opts.watchahead))
    .catch(err => console.log('makeBcoinCEV ERROR', err))

  return {}
}
