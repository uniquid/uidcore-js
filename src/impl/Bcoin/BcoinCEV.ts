import * as path from 'path'
import { startContractManager } from './BcoinCEV/CtrManager'
import { Pool } from './BcoinCEV/Pool'
import { formatTx } from './BcoinCEV/TX/parse'
import { sign as signTX } from './BcoinCEV/TX/sign'
import { HDPath } from './BcoinID/HD'
import { BcoinCEV } from './types/BcoinCEV'
import { BcoinDB } from './types/BcoinDB'
import { BcoinID } from './types/BcoinID'

// tslint:disable-next-line:no-require-imports
const Tx = require('bcoin/lib/primitives/tx')

export interface Options {
  home: string
  logLevel: 'error' | 'warning' | 'info' | 'debug' | 'spam'
  seeds: string[]
  watchahead: number
}
export const makeBcoinCEV = (db: BcoinDB, id: BcoinID, opts: Options): BcoinCEV => {
  const poolPromise = Pool({ dbFolder: path.join(opts.home, 'chain.db'), logLevel: opts.logLevel, seeds: opts.seeds })
  poolPromise
    .then(pool => startContractManager(db, id, pool, opts.watchahead))
    .catch(err => console.log('makeBcoinCEV ERROR', err))
  const sign = (txString: string, paths: HDPath[]) => {
    const { signedTxObj, txid } = signTX(id)(txString, paths)

    return poolPromise
      .then(pool => {
        const rawTx = Buffer.from(formatTx(signedTxObj))
        const BcoinTx = Tx.fromRaw(rawTx)

        return pool.broadcast(BcoinTx)
      })
      .then(() => txid)
  }

  return {
    sign,
  }
}
