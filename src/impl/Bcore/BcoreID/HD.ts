import { Buffer } from 'buffer'
import { AbstractIdentity, Identity, Role } from '../../../types/data/Identity'
// tslint:disable-next-line:no-require-imports
// const secp256k1 = require('bcoin/lib/crypto/secp256k1')
// tslint:disable-next-line:no-require-imports
const crypto = require('bcoin/lib/crypto')
// tslint:disable-next-line:no-require-imports
const base58 = require('bcoin/lib/utils/base58')
// tslint:disable-next-line:no-require-imports
const BcoinPrivateKey = require('bcoin/lib/hd/private')

export type Bip32Base58PrivKey = string
export type Base58Address = string
export type BcoinHDPrivateKey = {
  toBase58(): Bip32Base58PrivKey
  toPublic(): BcoinHDPublicKey
  derivePath(path: string): BcoinHDPrivateKey
}
export type BcoinHDPublicKey = { publicKey: PublicKey }
export type PublicKey = Buffer
export type PrivateKey = Buffer

export const derivePrivateKey = (bip32ExtMasterPrivateKey: Bip32Base58PrivKey) => (subPath: (string | number)[]) => {
  const masterPrivateKey: BcoinHDPrivateKey = BcoinPrivateKey.fromBase58(bip32ExtMasterPrivateKey)
  const derivedPrivkey = masterPrivateKey.derivePath("m/44'/0'/0/" + subPath.join('/'))
  // // 0 - Having a private ECDSA key
  // const privkey = buffer.Buffer.from('18E14A7B6A307F426A94F8114701E7C8E774E7F9A47E2C2035DB29A206321725', 'hex');

  // // 1 - Take the corresponding public key generated with it (65 bytes, 1 byte 0x04, 32 bytes corresponding to X coordinate, 32 bytes corresponding to Y coordinate)
  // const pubkey = secp256k1.publicKeyCreate(privkey, false);

  return derivedPrivkey
}

export const signFor = (bip32ExtMasterPrivateKey: Bip32Base58PrivKey) => (
  abstrId: AbstractIdentity<Role>,
  tx: string
): string => {
  return ''
}

export const identityFor = (bip32ExtMasterPrivateKey: Bip32Base58PrivKey) => <R extends Role>(
  abstrId: AbstractIdentity<R>
): Identity<R> => {
  const { role, index } = abstrId
  const isForProvider = role === Role.Provider
  const rolePath = isForProvider ? '0' : '1'
  const ctrPath = isForProvider ? '1' : '0'
  const subPath = [rolePath, ctrPath, index]
  const derivedPubkey = derivePrivateKey(bip32ExtMasterPrivateKey)(subPath).toPublic()
  // 2 - Perform SHA-256 hashing on the public key
  const step2: Buffer = crypto.sha256(derivedPubkey.publicKey)

  // 3 - Perform RIPEMD-160 hashing on the result of SHA-256
  const step3: Buffer = crypto.ripemd160(step2)

  // 4 - Add version byte in front of RIPEMD-160 hash (0x00 for Main Network)
  const b = Buffer.alloc(1)
  // tslint:disable-next-line:no-magic-numbers
  b.writeUInt8(0x6f, 0) // (111) https://en.bitcoin.it/wiki/List_of_address_prefixes
  const step4 = Buffer.concat([b, step3])

  // 5 - Perform SHA-256 hash on the extended RIPEMD-160 result
  const step5: Buffer = crypto.sha256(step4)

  // 6 - Perform SHA-256 hash on the result of the previous SHA-256 hash
  const step6: Buffer = crypto.sha256(step5)

  // 7 - Take the first 4 bytes of the second SHA-256 hash. This is the address checksum
  // tslint:disable-next-line:no-magic-numbers
  const step7 = step6.slice(0, 4)

  // 8 - Add the 4 checksum bytes from stage 7 at the end of extended RIPEMD-160 hash from stage 4. This is the 25-byte binary Bitcoin Address.
  const step8 = Buffer.concat([step4, step7])

  // 9 - Convert the result from a byte string into a base58 string using Base58Check encoding. This is the most commonly used Bitcoin Address format
  const address: Base58Address = base58.encode(step8)

  return {
    ...abstrId,
    address,
  }
}
