import * as fs from 'fs'
import * as path from 'path'
import * as hd from './BcoinID/HD'
import { BcoinID } from './types/BcoinID'
// tslint:disable-next-line:no-require-imports
const BcoinPrivateKey = require('bcoin/lib/hd/private')
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
}
const PK_FILE_NAME = 'private.key'
/**
 * constructs a {@link BcoinID}
 * @param {Options} options Options
 * @returns {Promise<BcoinID>}
 */
export const makeBcoinID = (options: Options): Promise<BcoinID> =>
  new Promise((resolve, reject) => {
    let privateKeyBase58: hd.Bip32Base58PrivKey
    const privateKeyFilePath = path.join(options.home, PK_FILE_NAME)
    const exists = fs.existsSync(privateKeyFilePath)
    if (exists) {
      privateKeyBase58 = fs.readFileSync(privateKeyFilePath, 'UTF8')
    } else {
      privateKeyBase58 = BcoinPrivateKey.generate().toBase58()
      fs.writeFileSync(privateKeyFilePath, privateKeyBase58, { encoding: 'UTF8' })
    }

    resolve({
      signFor: hd.signFor(privateKeyBase58),
      identityFor: hd.identityFor(privateKeyBase58),
      getImprintingAddress: hd.getImprintingAddress(privateKeyBase58),
      getOrchestrateAddress: hd.getOrchestrateAddress(privateKeyBase58),
      publicKeyAtPath: hd.publicKeyAtPath(privateKeyBase58),
      getBaseXpub: hd.getBaseXpub(privateKeyBase58)
    })
  })
