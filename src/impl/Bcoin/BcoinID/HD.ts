/**!
 *
 * Copyright 2016-2018 Uniquid Inc. or its affiliates. All Rights Reserved.
 *
 * License is in the "LICENSE" file accompanying this file.
 * See the License for the specific language governing permissions and limitations under the License.
 *
 */
import { Buffer } from 'buffer'
import { AbstractIdentity, Identity, Role } from '../../../types/data/Identity'
import { BcoinAbstractIdentity, BcoinIdentity } from './../types/data/BcoinIdentity'

// tslint:disable-next-line:no-require-imports
const varuint = require('varuint-bitcoin')
// tslint:disable-next-line:no-require-imports
const crypto = require('lcoin/lib/crypto')
// tslint:disable-next-line:no-require-imports
const secp256k1 = require('secp256k1')
// tslint:disable-next-line:no-require-imports
const bs58check = require('bs58check')
// tslint:disable-next-line:no-require-imports
const BcoinPrivateKey = require('lcoin/lib/hd/private')

export type AbstractIdentity<R extends Role> = AbstractIdentity<R>
export type Identity<R extends Role> = Identity<R>
export type Bip32Base58PrivKey = string
export type Bip32Base58PubKey = string
export type Base58Address = string
export type BcoinHDPrivateKey = {
  privateKey: PrivateKey
  toBase58(): Bip32Base58PrivKey
  toPublic(): BcoinHDPublicKey
  derivePath(path: string): BcoinHDPrivateKey
}
export type BcoinHDPublicKey = {
  publicKey: PublicKey
  toBase58(): Bip32Base58PubKey
}
export type PublicKey = Buffer
export type PrivateKey = Buffer
export type HDPath = (string)[]
const BASE_PATH: HDPath = ['m', `44'`, `0'`, '0']
const imprintingHDPath = ['0', '0', '0']
const orchestrationHDPath = ['0', '1', '0']
// export type DerivePrivateKey = (subPath: HDPath) => BcoinHDPrivateKey
const derivePrivateKey = (bip32ExtMasterPrivateKey: Bip32Base58PrivKey) => (subPath: HDPath) => {
  const masterPrivateKey: BcoinHDPrivateKey = BcoinPrivateKey.fromBase58(bip32ExtMasterPrivateKey)
  const derivedPrivkey = masterPrivateKey.derivePath([...BASE_PATH, ...subPath].join('/'))

  return derivedPrivkey
}

export const signFor = (bip32ExtMasterPrivateKey: Bip32Base58PrivKey) => (
  abstrId: BcoinAbstractIdentity<Role>,
  hash: Buffer,
  der = false
) => {
  /**
   * extract as (private?) function
   * it is necessary in 3 functions here
   */
  const isForProvider = abstrId.role === Role.Provider
  const rolePath = isForProvider ? '0' : '1'
  const extOrInt = abstrId.ext || (isForProvider ? '1' : '0')
  const subPath = [rolePath, extOrInt, `${abstrId.index}`]
  /**
   * ***
   */

  const privK = derivePrivateKey(bip32ExtMasterPrivateKey)(subPath)
  const res = secp256k1.sign(hash, privK.privateKey, { canonical: true })

  // tslint:disable-next-line:no-magic-numbers
  return der ? res.toDER() as Buffer : Buffer.concat([res.r.toBuffer(), res.s.toBuffer()], 64)
}

const base58AddrByPrivKey = (privkey: BcoinHDPrivateKey) => {
  /**
   * http://bcoin.io/guides/generate-address.html
   */

  const step1: Buffer = crypto.sha256(privkey.toPublic().publicKey)
  const step2: Buffer = crypto.ripemd160(step1)
  const b = Buffer.alloc(1)
  // tslint:disable-next-line:no-magic-numbers
  b.writeUInt8(0x6f, 0) // (111) https://en.bitcoin.it/wiki/List_of_address_prefixes
  const step3 = Buffer.concat([b, step2])
  const address: Base58Address = bs58check.encode(step3)

  return address
}
export const getImprintingAddress = (bip32ExtMasterPrivateKey: Bip32Base58PrivKey) => () => {
  const imprintingHDKey = derivePrivateKey(bip32ExtMasterPrivateKey)(imprintingHDPath)

  return base58AddrByPrivKey(imprintingHDKey)
}
export const getOrchestrateAddress = (bip32ExtMasterPrivateKey: Bip32Base58PrivKey) => () => {
  const orchestrationHDKey = derivePrivateKey(bip32ExtMasterPrivateKey)(orchestrationHDPath)

  return base58AddrByPrivKey(orchestrationHDKey)
}
export const getBaseXpub = (bip32ExtMasterPrivateKey: Bip32Base58PrivKey) => (): string =>
  derivePrivateKey(bip32ExtMasterPrivateKey)([]).toPublic().toBase58()

export const publicKeyAtPath = (bip32ExtMasterPrivateKey: Bip32Base58PrivKey) => (path: HDPath): PublicKey =>
  derivePrivateKey(bip32ExtMasterPrivateKey)(path).toPublic().publicKey
export const identityFor = (bip32ExtMasterPrivateKey: Bip32Base58PrivKey) => <R extends Role>(
  abstrId: BcoinAbstractIdentity<R>
): BcoinIdentity<R> => {
  const { role, index } = abstrId

  /**
   * extract as (private?) function
   * it is necessary in 3 functions here
   */
  const isForProvider = role === Role.Provider
  const rolePath = isForProvider ? '0' : '1'
  const extOrInt = abstrId.ext || (isForProvider ? '1' : '0')
  const subPath = [rolePath, extOrInt, `${index}`]
  /**
   * ***
   */

  const derivedPrivkey = derivePrivateKey(bip32ExtMasterPrivateKey)(subPath)
  const address = base58AddrByPrivKey(derivedPrivkey)

  return {
    ...abstrId,
    address
  }
}

export const signMessage = (bip32ExtMasterPrivateKey: Bip32Base58PrivKey) => (
  message: string,
  abstractIdentity: BcoinAbstractIdentity<Role>
) => {
  const messagePrefix = Buffer.from('\u0018Bitcoin Signed Message:\n', 'utf8')

  const messageVISize = varuint.encodingLength(message.length)
  const buffer = Buffer.allocUnsafe(messagePrefix.length + messageVISize + message.length)
  messagePrefix.copy(buffer, 0)
  varuint.encode(message.length, buffer, messagePrefix.length)
  buffer.write(message, messagePrefix.length + messageVISize)
  const hs = crypto.hash256(buffer)

  const isForProvider = abstractIdentity.role === Role.Provider
  const rolePath = isForProvider ? '0' : '1'
  const extOrInt = abstractIdentity.ext || (isForProvider ? '1' : '0')
  const subPath = [rolePath, extOrInt, `${abstractIdentity.index}`]

  const derivedPK = derivePrivateKey(bip32ExtMasterPrivateKey)(subPath)
  const sigObj = secp256k1.sign(hs, derivedPK.privateKey)
  // tslint:disable-next-line:no-magic-numbers
  sigObj.recovery += 4
  // tslint:disable-next-line:no-magic-numbers
  const signatureWithRecovery = Buffer.concat([Buffer.alloc(1, sigObj.recovery + 27), sigObj.signature])

  return signatureWithRecovery
}

export const recoverAddress = (bip32ExtMasterPrivateKey: Bip32Base58PrivKey) => (
  message: string,
  signature: string
) => {
  const signatureWithRecovery = Buffer.from(signature, 'base64')
  // tslint:disable-next-line:no-magic-numbers
  if (signatureWithRecovery.length !== 65) throw new Error('Invalid signature length')
  // tslint:disable-next-line:no-magic-numbers
  const flagByte = signatureWithRecovery.readUInt8(0) - 27
  // tslint:disable-next-line:no-magic-numbers
  if (flagByte > 7) throw new Error('Invalid signature parameter')

  const parsed = {
    // tslint:disable-next-line:no-magic-numbers no-bitwise
    compressed: !!(flagByte & 4),
    // tslint:disable-next-line:no-magic-numbers no-bitwise
    recovery: flagByte & 3,
    signature: signatureWithRecovery.slice(1)
  }

  const messagePrefix = Buffer.from('\u0018Bitcoin Signed Message:\n', 'utf8')

  const messageVISize = varuint.encodingLength(message.length)
  const buffer = Buffer.allocUnsafe(messagePrefix.length + messageVISize + message.length)
  messagePrefix.copy(buffer, 0)
  varuint.encode(message.length, buffer, messagePrefix.length)
  buffer.write(message, messagePrefix.length + messageVISize)
  const hs = crypto.hash256(buffer)

  const publicKey = secp256k1.recover(hs, parsed.signature, parsed.recovery, parsed.compressed)
  const sh = crypto.sha256(publicKey)
  const add = crypto.ripemd160(sh)

  const newbuffer = Buffer.allocUnsafe(add.length + 1)
  newbuffer.write('\u006f', 0)
  add.copy(newbuffer, 1)

  return bs58check.encode(newbuffer)
}

export const verifyMessage = (bip32ExtMasterPrivateKey: Bip32Base58PrivKey) => (message: string, signature: string) => {
  // tslint:disable-next-line:no-require-imports
  const bitcoinMessage = require('bitcoinjs-message')
  const sBuffer = Buffer.from(signature, 'base64')
  const rAddr = recoverAddress(bip32ExtMasterPrivateKey)(message, signature)
  const _verify = bitcoinMessage.verify(message, rAddr, sBuffer)
  if (_verify) return { verify: _verify, address: rAddr }

  return {}
}
