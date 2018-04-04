import { Role } from '../../../../types/data/Identity'
import { HDPath } from '../../BcoinID/HD'
import { BcoinID } from '../../types/BcoinID'
import { BcoinAbstractIdentity, ExtPath } from '../../types/data/BcoinIdentity'
import { formatTx, InputObj, intArrayToRawTxString, parseTx, TXObj } from './parse'
// import { encodeVarint } from './varint'

// tslint:disable-next-line:no-require-imports
const sha265x = require('bcoin/lib/crypto/sha256')
// tslint:disable-next-line:no-require-imports
// const sha265 = require('sha.js/sha256')
// tslint:disable-next-line:no-require-imports
const crypto = require('bcoin/lib/crypto')

const signInputMapper = (id: BcoinID, txObj: TXObj, emptyScriptsTxObj: TXObj) => (
  path: HDPath,
  pathIndex: number
): InputObj => {
  const originalInput = txObj.inputs[pathIndex]
  const publicKey = id.derivePrivateKey(path).toPublic().publicKey

  const localInputs = emptyScriptsTxObj.inputs.map((currEmptyScriptInput, currEmptyScriptInputIndex) => {
    if (currEmptyScriptInputIndex === pathIndex) {
      const step2: Buffer = crypto.sha256(publicKey)

      // 3 - Perform RIPEMD-160 hashing on the result of SHA-256
      const step3: Buffer = crypto.ripemd160(step2)
      const h160 = Array.from(step3)
      // console.log('publicKey', intArrayToRawTxString(Array.from(publicKey)))
      // console.log('h160', intArrayToRawTxString(h160), h160.length)
      // prettier-ignore
      // tslint:disable-next-line:no-magic-numbers
      const script = [0x76, 0xa9, 0x14, ...h160, 0x88, 0xac]
      // console.log('script', intArrayToRawTxString(script))

      return {
        ...originalInput,
        script,
      }
    } else {
      return currEmptyScriptInput
    }
  })
  // console.log('originalInput', originalInput)
  // console.log('emptyScriptsTxObjInput', emptyScriptsTxObj.inputs[pathIndex])

  const localTxObj = {
    ...emptyScriptsTxObj,
    inputs: localInputs,
  }
  // console.log('localTxObj', localTxObj)

  // append hash code type
  const localTxForSign = formatTx(localTxObj).concat([0x01, 0x00, 0x00, 0x00])
  // console.log(formatTx(localTxObj).length, localTxForSign.length)
  // console.log(intArrayToRawTxString(formatTx(localTxObj)))
  // console.log('localTxForSign', intArrayToRawTxString(localTxForSign))
  const hash = sha265x.hash256(localTxForSign)
  // const hash2 = new sha265().update(new sha265().update(localTxForSign).digest()).digest()
  // console.log('', intArrayToRawTxString(hash), '\n', intArrayToRawTxString(hash2))
  // console.log(`txHash for Input[${pathIndex}] : <${hash.toString('hex')}>`)
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
  // console.log('DER', intArrayToRawTxString(Array.from(DERsignature)))
  const DERWithHashCode = Buffer.concat([DERsignature, Buffer.from([0x01])])
  // console.log('DERWithHashCode.length', DERWithHashCode.length)
  // tslint:disable-next-line:no-magic-numbers
  const OP_PUSH_DER = DERWithHashCode.length === 71 ? 0x47 : 0x48

  // tslint:disable-next-line:no-magic-numbers
  const OP_PUSH_PK = 0x21
  // console.log('publicKey.length', publicKey.length, OP_PUSH_PK)
  // console.log('publicKey', intArrayToRawTxString(Array.from(publicKey)))

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

export const sign = (id: BcoinID) => (rawtx: string, paths: HDPath[], asString = false) => {
  const txObj = parseTx(rawtx)
  if (txObj.inputs.length !== paths.length) {
    throw TypeError('Inputs and paths lengths should be equal')
  }

  const emptyScriptsInputs: InputObj[] = txObj.inputs.map(input => ({
    ...input,
    script: [],
  }))

  const emptyScriptsTxObj: TXObj = {
    ...txObj,
    inputs: emptyScriptsInputs,
  }

  const inputs = paths.map(signInputMapper(id, txObj, emptyScriptsTxObj))

  const signedTxObj = {
    ...txObj,
    inputs,
  }
  // console.log(emptyScriptsTxObj.inputs)
  // console.log(signedTxObj.inputs)
  // console.log(txObj.inputs)
  // console.log(intArrayToRawTxString(formatTx(signedTxObj)))
  // return new sha265().update(new sha265().update(formatTx(signedTxObj)).digest()).digest('hex')

  const txid: Buffer = sha265x.hash256(formatTx(signedTxObj))
  const txidReverse = Array.from(txid).reverse()

  return intArrayToRawTxString(txidReverse)
  // return intArrayToRawTxString(formatTx(signedTxObj))
}
