import { IdAddress } from '../../../types/data/Identity'
import { formatTx, TXObj } from './TX/parse'
// tslint:disable-next-line:no-require-imports
const Tx = require('bcoin/lib/primitives/tx')

// tslint:disable-next-line:no-require-imports
const bcoin = require('bcoin')
bcoin.networks.uq = Object.assign({}, bcoin.networks.regtest, {
  port: 19000,
  addressPrefix: bcoin.networks.testnet.addressPrefix,
  keyPrefix: Object.assign({}, bcoin.networks.testnet.keyPrefix, {
    coinType: 0
  })
})
bcoin.set('uq')
const BROADCAST_WAIT_BEFORE_RESPONSE = 3000
const BROADCAST_TIMEOUT = 60000
/**
 * Options for constructing a BCPool
 * @interface Options
 * @export
 */
export interface Options {
  /**
   * an array of Bitcoin Full Nodes' IPs
   * used as initial seeds for the BC network
   * @type {string[]}
   * @memberof Options
   */
  seeds: string[]
  /**
   * absolute path to folder for BC's Spv Storage
   * @type {string}
   * @memberof Options
   */
  dbFolder: string
  logLevel: 'error' | 'warning' | 'info' | 'debug' | 'spam'
}
/**
 * A Bcoin Pool wrapper for UQ {@link BcoinCEV} it handles Bitcoin Network net communication and exposes UQ related necessary functions
 * @interface BCPool
 * @export
 */
export interface BCPool {
  /**
   * When invoked, the pool is set in sync mode and waits for a block containing transactions involving the provided adrresses
   *
   * When such a block is being notified from network, transactions are resolved on the returning Promise
   *
   * The pool is then set asleep, unwatching everything and stopping sync
   * @param {IdAddress[]} addresses the addresses to be watched
   * @returns {Promise<BCTX[]>} a Promise of Transactions (Bcoin lib TX objects)
   * @memberof BCPool
   */
  watchAddresses(addresses: IdAddress[]): Promise<BCTX[]>
  /**
   * Broadcasts a transaction to the network
   * @param {string} txid the transaction ID
   * @param {TXObj} txObj the {@link TXObj} representing the transaction
   * @returns {Promise<void>} The promise is rejected on BROADCAST_TIMEOUT(60secs), and on error occourring during broadcast
   *
   * if broadcasting succeeds BROADCAST_WAIT_BEFORE_RESPONSE(3secs) are waited before resolving Promise, to let the mempools digest the newly broadcasted TX
   * @memberof BCPool
   */
  broadcast(txid: string, txObj: TXObj): Promise<void>
}
/**
 * constructs a Pool
 * @param {Options} options Options for constructing the Pool
 * @returns {Promise<BCPool>}
 */
export const Pool = async (options: Options): Promise<BCPool> => {
  const chainLogger = new bcoin.logger({
    level: options.logLevel
  })
  const poolLogger = new bcoin.logger({
    level: options.logLevel
  })

  const chain = bcoin.chain({ logger: chainLogger, db: 'leveldb', location: options.dbFolder, spv: true })
  const pool = new bcoin.pool({
    logger: poolLogger,
    seeds: options.seeds,
    chain,
    maxPeers: 8
  })

  await chainLogger.open()
  await poolLogger.open()

  await pool.open()
  await pool.connect()

  const watchAddresses = async (addresses: IdAddress[]) =>
    new Promise<BCTX[]>((resolve, reject) => {
      addresses.forEach(address => pool.watchAddress(address))
      const listener = (block: any, entry: any) => {
        // console.log(`BLOCK: ${block.toJSON().hash}`, block.txs)

        if (block.txs.length) {
          pool.stopSync()
          // pool.disconnect()
          // pool.close()
          pool.unwatch()
          pool.removeListener('block', listener)
          resolve(block.txs)
        }
      }

      pool.on('block', listener)
      pool.startSync()
      pool.sync(true)
    })

  const broadcast = (txid: string, txObj: TXObj) =>
    new Promise<void>(async (resolve, reject) => {
      const rawTx = Buffer.from(formatTx(txObj))
      const msg = Tx.fromRaw(rawTx)
      setTimeout(() => reject('Broadcast timeout'), BROADCAST_TIMEOUT)
      pool.broadcast(msg).then(() => setTimeout(resolve, BROADCAST_WAIT_BEFORE_RESPONSE), reject)
    })

  return {
    watchAddresses,
    broadcast
  }
}
export interface BCTX {
  [k: string]: any
}
