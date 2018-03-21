// tslint:disable-next-line:no-require-imports
const bcoin = require('bcoin')
bcoin.set('uq')
bcoin.networks.uq = Object.assign({}, bcoin.networks.regtest, {
  port: 19000,
  addressPrefix: bcoin.networks.testnet.addressPrefix,
  keyPrefix: Object.assign({}, bcoin.networks.testnet.keyPrefix, {
    coinType: 0,
  }),
})

export interface Options {
  logLevel: 'error' | 'warning' | 'info' | 'debug' | 'spam'
  poolDBFolder: string
  seeds: string[]
}
export const Pool = async (opts: Options) => {
  const chainLogger = new bcoin.logger({
    level: opts.logLevel,
  })
  const poolLogger = new bcoin.logger({
    level: opts.logLevel,
  })
  // const wallLogger = new bcoin.logger({
  //   level: opts.logLevel,
  // })
  // const wallDBLogger = new bcoin.logger({ level: opts.logLevel })

  const chain = bcoin.chain({ logger: chainLogger, db: 'leveldb', location: opts.poolDBFolder, spv: true })
  const pool = new bcoin.pool({
    logger: poolLogger,
    seeds: opts.seeds,
    chain,
    maxPeers: 8,
  })

  await chainLogger.open()
  await poolLogger.open()
  await pool.open()

  return pool
}
