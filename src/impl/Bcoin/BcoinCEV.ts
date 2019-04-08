/**!
 *
 * Copyright 2016-2018 Uniquid Inc. or its affiliates. All Rights Reserved.
 *
 * License is in the "LICENSE" file accompanying this file.
 * See the License for the specific language governing permissions and limitations under the License.
 *
 */
import { existsSync, mkdirSync } from 'fs'
import * as path from 'path'
import { ProviderNameResolver, startContractManager } from './BcoinCEV/CtrManager'
import { Pool } from './BcoinCEV/Pool'
import { formatTx } from './BcoinCEV/TX/parse'
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

  /**
   * the bcoin logger
   * @type {string}
   * @memberof Options
   */
  logger: any
}
/**
 * constructs a {@link BcoinCEV}
 * @param {BcoinDB} db a BcoinDB instance
 * @param {BcoinID} id a BcoinID instance
 * @param {Options} options Options
 * @returns {BcoinCEV}
 */
export const makeBcoinCEV = async (db: BcoinDB, id: BcoinID, options: Options): Promise<BcoinCEV> => {
  if (!existsSync(options.home)) {
    mkdirSync(options.home)
  }

  const pool = await Pool({
    dbFolder: path.join(options.home, 'chain.db'),
    logger: options.logger,
    seeds: options.seeds
  })
  startContractManager(db, id, pool, options.watchahead, options.providerNameResolver, options.logger).catch(e =>
    options.logger.error(`startContractManager ERROR : ${e}`)
  )
  const signRawTransaction = async (txString: string, paths: HDPath[]) => {
    const { signedTxObj } = transactionSigner(id, txString, paths)

    return Buffer.from(formatTx(signedTxObj)).toString('hex')

    // await pool.broadcast(txid, signedTxObj)
    // return txid
  }

  return {
    signRawTransaction
  }
}
