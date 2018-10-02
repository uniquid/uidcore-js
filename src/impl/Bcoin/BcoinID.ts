import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs'
import * as path from 'path'
import * as hd from './BcoinID/HD'
import { BcoinID } from './types/BcoinID'
// tslint:disable-next-line:no-require-imports
const BcoinPrivateKey = require('lcoin/lib/hd/private')
// tslint:disable-next-line:no-require-imports
const bcoin = require('lcoin')
bcoin.networks.uqregtest = Object.assign({}, bcoin.networks.regtest, {
  port: 19000,
  addressPrefix: bcoin.networks.testnet.addressPrefix,
  keyPrefix: Object.assign({}, bcoin.networks.testnet.keyPrefix, {
    coinType: 0
  }),
  seeds: ['40.115.9.216', '40.115.10.153', '40.115.103.9']
})

/**
 * Options for constructing a {@link BcoinID}
 * @interface Options
 * @export
 */
export interface Options {
  /**
   * absolute path to the {@link BcoinID} home folder for file persistence
   * @type {string}
   * @memberof Options
   */
  home: string
  network: 'uqregtest' | 'main' | 'testnet' | 'regtest' | 'segnet3' | 'segnet4'
}
const PK_FILE_NAME = 'private.key'
/**
 * constructs a {@link BcoinID}
 * @param {Options} options Options
 * @returns {Promise<BcoinID>}
 */
export const makeBcoinID = (options: Options): Promise<BcoinID> => {
  bcoin.set(options.network)

  return new Promise((resolve, reject) => {
    if (!existsSync(options.home)) {
      mkdirSync(options.home)
    }
    let privateKeyBase58: hd.Bip32Base58PrivKey
    const privateKeyFilePath = path.join(options.home, PK_FILE_NAME)
    const exists = existsSync(privateKeyFilePath)
    if (exists) {
      privateKeyBase58 = readFileSync(privateKeyFilePath, 'UTF8')
    } else {
      privateKeyBase58 = BcoinPrivateKey.generate().toBase58()
      writeFileSync(privateKeyFilePath, privateKeyBase58, { encoding: 'UTF8' })
    }

    resolve({
      signFor: hd.signFor(privateKeyBase58),
      identityFor: hd.identityFor(privateKeyBase58),
      getImprintingAddress: hd.getImprintingAddress(privateKeyBase58),
      getOrchestrateAddress: hd.getOrchestrateAddress(privateKeyBase58),
      publicKeyAtPath: hd.publicKeyAtPath(privateKeyBase58),
      getBaseXpub: hd.getBaseXpub(privateKeyBase58),
      signMessage: hd.signMessage(privateKeyBase58)
    })
  })
}
