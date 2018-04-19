import { Role } from '../../../../types/data/Identity'
import { HDPath } from '../../BcoinID/HD'
import { BcoinID } from '../../types/BcoinID'
import { BcoinAbstractIdentity, ExtPath } from '../../types/data/BcoinIdentity'
import { intArrayToRawHexString } from './../../utils/hex'
import { formatTx, InputObj, parseTx, TXObj } from './parse'
// tslint:disable-next-line:no-require-imports
const sha265 = require('bcoin/lib/crypto/sha256')
// tslint:disable-next-line:no-require-imports
const crypto = require('bcoin/lib/crypto')

const inputSignerFor = (id: BcoinID, txObj: TXObj) => (path: HDPath, pathIndex: number): InputObj => {
  const originalInput = txObj.inputs[pathIndex]
  const publicKey = id.publicKeyAtPath(path)

  const localInputs = txObj.inputs.map((currScriptInput, currScriptInputIndex) => {
    if (currScriptInputIndex === pathIndex) {
      const pubkeySha256: Buffer = crypto.sha256(publicKey)
      const pubkeyHashRipmed160: Buffer = crypto.ripemd160(pubkeySha256)
      const pubkeyHashRipmed160Array = Array.from(pubkeyHashRipmed160)
      // prettier-ignore
      // tslint:disable-next-line:no-magic-numbers
      const script = [0x76, 0xa9, 0x14, ...pubkeyHashRipmed160Array, 0x88, 0xac]

      return { ...originalInput, script }
    } else {
      return {
        ...currScriptInput,
        script: [],
      }
    }
  })

  const localTxObj = {
    ...txObj,
    inputs: localInputs,
  }

  // append hash code type
  const localTxForSign = formatTx(localTxObj).concat([0x01, 0x00, 0x00, 0x00])
  const hash = sha265.hash256(localTxForSign)
  const role = Number(path[0]) === 0 ? Role.Provider : Role.User
  type LocalRole = typeof role
  const ext = path[1] as ExtPath
  // tslint:disable-next-line:no-magic-numbers
  const index = Number(path[2])
  const absId: BcoinAbstractIdentity<LocalRole> = {
    role,
    ext,
    index,
  }
  const DERsignature = Buffer.from(id.signFor(absId, hash, true))
  const DERWithHashCode = Buffer.concat([DERsignature, Buffer.from([0x01])])
  // tslint:disable-next-line:no-magic-numbers
  const OP_PUSH_DER = DERWithHashCode.length === 71 ? 0x47 : 0x48

  // tslint:disable-next-line:no-magic-numbers
  const OP_PUSH_PK = 0x21

  // prettier-ignore
  const script = Array.from(Buffer.concat([
    Buffer.from([OP_PUSH_DER]),
    DERWithHashCode,
    Buffer.from([OP_PUSH_PK]),
    publicKey
  ]))

  return {
    ...originalInput,
    script,
  }
}

export const sign = (id: BcoinID) => (rawtx: string, paths: HDPath[]) => {
  const txObj = parseTx(rawtx)
  if (txObj.inputs.length !== paths.length) {
    throw TypeError('Inputs and paths lengths should be equal')
  }
  const inputSigner = inputSignerFor(id, txObj)
  const inputs = paths.map(inputSigner)

  const signedTxObj: TXObj = {
    ...txObj,
    inputs,
  }

  const txid: Buffer = sha265.hash256(formatTx(signedTxObj))
  const txidReverse = Array.from(txid).reverse()

  return { txid: intArrayToRawHexString(txidReverse), signedTxObj }
}
