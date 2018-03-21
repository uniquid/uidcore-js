import * as fs from 'fs'
import * as path from 'path'
import * as hd from './BcoreID/HD'
import { BcoreID as BcoreIDType } from './types/BcoreID'
// tslint:disable-next-line:no-require-imports
const BcoinPrivateKey = require('bcoin/lib/hd/private')

export const BcoreID = (): BcoreIDType => {
  console.log(path, fs)
  const privateKeyFilePath = path.join(process.cwd(), 'PrivK')
  const exists = fs.existsSync(privateKeyFilePath)
  console.log(exists)
  let privateKeyBase58: hd.Bip32Base58PrivKey
  if (exists) {
    privateKeyBase58 = fs.readFileSync(privateKeyFilePath, 'UTF8')
  } else {
    privateKeyBase58 = BcoinPrivateKey.generate().toBase58()
    fs.writeFileSync(privateKeyFilePath, privateKeyBase58, { encoding: 'UTF8' })
  }
  const bcoinPrivateKey = BcoinPrivateKey.fromBase58(privateKeyBase58)
  console.log(bcoinPrivateKey.xprivkey())

  return {
    signFor: hd.signFor(privateKeyBase58),
    identityFor: hd.identityFor(privateKeyBase58),
  }
}

/**
 * http://bcoin.io/guides/generate-address.html
 */
