import { IdAddress } from '../../../types/data/Identity'
import { TXObj } from './../../../../lib-esm/impl/Bcoin/BcoinCEV/TX/parse.d'
import { formatTx } from './TX/parse'
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
export const BROADCAST_WAIT_BEFORE_RESPONSE = 3000
export const BROADCAST_TIMEOUT = 60000
export interface Options {
  logLevel: 'error' | 'warning' | 'info' | 'debug' | 'spam'
  dbFolder: string
  seeds: string[]
}

export interface BCPool {
  watchAddresses(addresses: IdAddress[]): Promise<BCTX[]>
  broadcast(txid: string, txObj: TXObj): Promise<void>
}
export const Pool = async (opts: Options): Promise<BCPool> => {
  const chainLogger = new bcoin.logger({
    level: opts.logLevel
  })
  const poolLogger = new bcoin.logger({
    level: opts.logLevel
  })

  const chain = bcoin.chain({ logger: chainLogger, db: 'leveldb', location: opts.dbFolder, spv: true })
  const pool = new bcoin.pool({
    logger: poolLogger,
    seeds: opts.seeds,
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
