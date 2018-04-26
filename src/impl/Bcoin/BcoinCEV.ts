import * as path from 'path'
import { ProviderNameResolver, startContractManager } from './BcoinCEV/CtrManager'
import { Pool } from './BcoinCEV/Pool'
import { sign as signTX } from './BcoinCEV/TX/sign'
import { HDPath } from './BcoinID/HD'
import { BcoinCEV } from './types/BcoinCEV'
import { BcoinDB } from './types/BcoinDB'
import { BcoinID } from './types/BcoinID'

export interface Options {
  home: string
  logLevel: 'error' | 'warning' | 'info' | 'debug' | 'spam'
  seeds: string[]
  watchahead: number
  providerNameResolver: ProviderNameResolver
}
export const makeBcoinCEV = (db: BcoinDB, id: BcoinID, opts: Options): BcoinCEV => {
  const poolPromise = Pool({ dbFolder: path.join(opts.home, 'chain.db'), logLevel: opts.logLevel, seeds: opts.seeds })
  poolPromise
    .then(pool => startContractManager(db, id, pool, opts.watchahead, opts.providerNameResolver))
    .catch(err => console.log('makeBcoinCEV ERROR', err))
  const sign = (txString: string, paths: HDPath[]) => {
    const { signedTxObj, txid } = signTX(id)(txString, paths)

    return poolPromise.then(pool => pool.broadcast(txid, signedTxObj)).then(() => txid)
  }

  return {
    sign
  }
}
