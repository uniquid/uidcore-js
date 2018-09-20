import { existsSync, mkdir } from 'fs'
import * as path from 'path'
import { ProviderNameResolver, startContractManager } from './BcoinCEV/CtrManager'
import { Options as PoolOptions, Pool } from './BcoinCEV/Pool'
import { transactionSigner } from './BcoinCEV/TX/sign'
import { HDPath } from './BcoinID/HD'
import { BcoinCEV } from './types/BcoinCEV'
import { BcoinDB } from './types/BcoinDB'
import { BcoinID } from './types/BcoinID'

/**
 * Options for constructing a {@link BcoinCEV}
 * @interface Options
 * @export
 */
export interface Options {
  /**
   * absolute path to the {@link BcoinCEV} home folder for file persistence
   * @type {string}
   * @memberof Options
   */
  home: string
  /**
   * an array of Bitcoin Full Nodes' IPs
   * used as initial seeds for the BC network
   * @type {string[]}
   * @memberof Options
   */
  seeds: string[]
  /**
   * HOW many BIP32 address indexes, (as User|Provider) to watch ahead (Bitcoin wallet style)
   * @type {number}
   * @memberof Options
   */
  watchahead: number
  /**
   * A service that resolves the provider's name by it's address
   * @type {ProviderNameResolver}
   * @memberof Options
   */
  providerNameResolver: ProviderNameResolver
  logLevel: 'error' | 'warning' | 'info' | 'debug' | 'spam'
  network: PoolOptions['network']
}
/**
 * constructs a {@link BcoinCEV}
 * @param {BcoinDB} db a BcoinDB instance
 * @param {BcoinID} id a BcoinID instance
 * @param {Options} options Options
 * @returns {BcoinCEV}
 */
export const makeBcoinCEV = (db: BcoinDB, id: BcoinID, options: Options): BcoinCEV => {
  if (!existsSync(options.home)) {
    mkdir(options.home)
  }
  const poolPromise = Pool({
    dbFolder: path.join(options.home, 'chain.db'),
    logLevel: options.logLevel,
    seeds: options.seeds,
    network: options.network
  })
  poolPromise
    .then(pool => startContractManager(db, id, pool, options.watchahead, options.providerNameResolver))
    .catch(err => console.log('makeBcoinCEV ERROR', err))
  const signRawTransaction = (txString: string, paths: HDPath[]) => {
    const { signedTxObj, txid } = transactionSigner(id, txString, paths)

    return poolPromise.then(pool => pool.broadcast(txid, signedTxObj)).then(() => txid)
  }

  return {
    signRawTransaction
  }
}
