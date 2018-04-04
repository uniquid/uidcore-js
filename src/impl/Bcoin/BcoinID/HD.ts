import { Buffer } from 'buffer'
import { AbstractIdentity, Identity, Role } from '../../../types/data/Identity'
import { BcoinAbstractIdentity, BcoinIdentity } from './../types/data/BcoinIdentity'
// tslint:disable-next-line:no-require-imports
const crypto = require('bcoin/lib/crypto')
// tslint:disable-next-line:no-require-imports
const secp256k1 = require('elliptic').ec('secp256k1')
// tslint:disable-next-line:no-require-imports
const base58 = require('bcoin/lib/utils/base58')
// tslint:disable-next-line:no-require-imports
const BcoinPrivateKey = require('bcoin/lib/hd/private')
export type AbstractIdentity<R extends Role> = AbstractIdentity<R>
export type Identity<R extends Role> = Identity<R>
export type Bip32Base58PrivKey = string
export type Base58Address = string
export type BcoinHDPrivateKey = {
  privateKey: PrivateKey
  toBase58(): Bip32Base58PrivKey
  toPublic(): BcoinHDPublicKey
  derivePath(path: string): BcoinHDPrivateKey
}
export type BcoinHDPublicKey = { publicKey: PublicKey }
export type PublicKey = Buffer
export type PrivateKey = Buffer
export type HDPath = (string | number)[]
const BASE_PATH: HDPath = ['m', "44'", "0'", 0]
export type DerivePrivateKey = (subPath: HDPath) => BcoinHDPrivateKey
export const derivePrivateKey = (bip32ExtMasterPrivateKey: Bip32Base58PrivKey): DerivePrivateKey => (
  subPath: HDPath
) => {
  const masterPrivateKey: BcoinHDPrivateKey = BcoinPrivateKey.fromBase58(bip32ExtMasterPrivateKey)
  const derivedPrivkey = masterPrivateKey.derivePath([...BASE_PATH, ...subPath].join('/'))

  return derivedPrivkey
}

export const signFor = (bip32ExtMasterPrivateKey: Bip32Base58PrivKey) => (
  abstrId: BcoinAbstractIdentity<Role>,
  hash: Buffer,
  // tslint:disable-next-line:no-inferrable-types
  der = false
) => {
  const isForProvider = abstrId.role === Role.Provider
  const rolePath = isForProvider ? 0 : 1
  const extOrInt = abstrId.ext || (isForProvider ? '1' : '0')
  const subPath = [rolePath, extOrInt, abstrId.index]
  const privK = derivePrivateKey(bip32ExtMasterPrivateKey)(subPath)
  const res = secp256k1.sign(hash, privK.privateKey, { canonical: true })

  // tslint:disable-next-line:no-magic-numbers
  return der ? res.toDER() as Buffer : Buffer.concat([res.r.toBuffer(), res.s.toBuffer()], 64)
}

export const base58AddrByPrivKey = (privkey: BcoinHDPrivateKey) => {
  /**
   * http://bcoin.io/guides/generate-address.html
   */

  const step1: Buffer = crypto.sha256(privkey.toPublic().publicKey)
  const step2: Buffer = crypto.ripemd160(step1)
  const b = Buffer.alloc(1)
  // tslint:disable-next-line:no-magic-numbers
  b.writeUInt8(0x6f, 0) // (111) https://en.bitcoin.it/wiki/List_of_address_prefixes
  const step3 = Buffer.concat([b, step2])
  const step4: Buffer = crypto.sha256(step3)
  const step5: Buffer = crypto.sha256(step4)
  // tslint:disable-next-line:no-magic-numbers
  const step6 = step5.slice(0, 4)
  const step7 = Buffer.concat([step3, step6])
  const address: Base58Address = base58.encode(step7)

  return address
}

export const identityFor = (bip32ExtMasterPrivateKey: Bip32Base58PrivKey) => <R extends Role>(
  abstrId: BcoinAbstractIdentity<R>
): BcoinIdentity<R> => {
  const { role, index } = abstrId
  const isForProvider = role === Role.Provider
  const rolePath = isForProvider ? '0' : '1'
  const extOrInt = abstrId.ext || (isForProvider ? '1' : '0')
  const subPath = [rolePath, extOrInt, index]
  const derivedPrivkey = derivePrivateKey(bip32ExtMasterPrivateKey)(subPath)
  const address = base58AddrByPrivKey(derivedPrivkey)

  return {
    ...abstrId,
    address,
  }
}
