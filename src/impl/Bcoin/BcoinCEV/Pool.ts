import { Base58Address } from '../BcoinID/HD'

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
  logLevel?: 'error' | 'warning' | 'info' | 'debug' | 'spam'
  dbFolder?: string
  seeds?: string[]
}
const defOpts: Options = {
  logLevel: 'spam',
  dbFolder: 'chain_db',
  seeds: ['52.225.217.168', '52.167.211.151', '52.225.218.133'],
}
export interface BCPool {
  waitForAddressBlock(address: string): Promise<{}>
}
export const Pool = async (opts?: Options): Promise<BCPool> => {
  opts = {
    ...defOpts,
    ...opts,
  }
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
  const waitForAddressBlock = async (address: Base58Address) =>
    new Promise((resolve, reject) => {
      // console.log('watching', address)
      pool.stopSync()
      pool.unwatch()
      pool.watchAddress(address)
      const listener = (block: any, entry: any) => {
        if (block.txs.length) {
          pool.removeListener('block', listener)
          resolve(block)
        }
      }
      pool.on('block', listener)
      pool.startSync()
      pool.sync(true)
    })
  // const watchIdentities = async <R extends Role>(identity: Identity<R>) => {
  //   return waitForAddressBlock()
  // }

  return {
    waitForAddressBlock,
  }
}
