import * as fs from 'fs'
import * as path from 'path'
import * as hd from './BcoinID/HD'
import { BcoinID as BcoinIDType } from './types/BcoinID'
// tslint:disable-next-line:no-require-imports
const BcoinPrivateKey = require('bcoin/lib/hd/private')

export interface Options {
  pkFile?: string
  privateKey?: string
}
const defOpts: Options = {
  pkFile: path.join(process.cwd(), 'PrivK'),
}
export const BcoinID = (opts?: Options): Promise<BcoinIDType> =>
  new Promise((resolve, reject) => {
    opts = {
      ...defOpts,
      ...opts,
    }
    let privateKeyBase58: hd.Bip32Base58PrivKey
    if (opts.privateKey) {
      privateKeyBase58 = opts.privateKey
    } else if (opts.pkFile) {
      const privateKeyFilePath = opts.pkFile
      const exists = fs.existsSync(privateKeyFilePath)
      if (exists) {
        privateKeyBase58 = fs.readFileSync(privateKeyFilePath, 'UTF8')
      } else {
        privateKeyBase58 = BcoinPrivateKey.generate().toBase58()
        fs.writeFileSync(privateKeyFilePath, privateKeyBase58, { encoding: 'UTF8' })
      }
    } else {
      throw TypeError('Shouldnt happen')
    }

    resolve({
      signFor: hd.signFor(privateKeyBase58),
      identityFor: hd.identityFor(privateKeyBase58),
      derivePrivateKey: hd.derivePrivateKey(privateKeyBase58),
    })
  })
