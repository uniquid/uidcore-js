import { IdAddress } from '../../../types/data/Identity'

// tslint:disable-next-line:no-require-imports
const bcoin = require('bcoin')
bcoin.networks.uq = Object.assign({}, bcoin.networks.regtest, {
  port: 19000,
  addressPrefix: bcoin.networks.testnet.addressPrefix,
  keyPrefix: Object.assign({}, bcoin.networks.testnet.keyPrefix, {
    coinType: 0,
  }),
})
bcoin.set('uq')

export interface Options {
  logLevel: 'error' | 'warning' | 'info' | 'debug' | 'spam'
  dbFolder: string
  seeds: string[]
}

export interface BCPool {
  watchAddresses(addresses: IdAddress[]): Promise<BCTX[]>
}
export const Pool = async (opts: Options): Promise<BCPool> => {
  const chainLogger = new bcoin.logger({
    level: opts.logLevel,
  })
  const poolLogger = new bcoin.logger({
    level: opts.logLevel,
  })

  const chain = bcoin.chain({ logger: chainLogger, db: 'leveldb', location: opts.dbFolder, spv: true })
  const pool = new bcoin.pool({
    logger: poolLogger,
    seeds: opts.seeds,
    chain,
    maxPeers: 8,
  })

  await chainLogger.open()
  await poolLogger.open()

  await pool.open()
  await pool.connect()
  const watchAddresses = async (addresses: IdAddress[]) =>
    new Promise<BCTX[]>((resolve, reject) => {
      console.log(`WATCH: `, addresses.reduce((s, a, i) => `${s}\n${i} : ${a}`, ''))
      addresses.forEach(address => pool.watchAddress(address))
      const listener = (block: any, entry: any) => {
        console.log(`BLOCK: ${block.toJSON().hash}`, block.txs)

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

  return {
    watchAddresses,
  }
}
export interface BCTX {
  [k: string]: any
}
