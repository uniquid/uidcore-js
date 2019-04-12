/**!
 *
 * Copyright 2016-2018 Uniquid Inc. or its affiliates. All Rights Reserved.
 *
 * License is in the "LICENSE" file accompanying this file.
 * See the License for the specific language governing permissions and limitations under the License.
 *
 */
import { rawHexStringToIntArray } from './../../utils/hex'
import { InputObj } from './parse'
import { decodeVarInt, encodeVarint } from './varint'
const VERSION_LENGTH = 4
const TX_HASH_LENGTH = 32
const INPUT_INDEX_LENGTH = 4
const SEQ_LENGTH = 4
const splitList = <T>(list: T[], at: number) => ({
  head: list.slice(0, at),
  tail: list.slice(at)
})

/**
 * A data structure abstracting a BC transaction's relevant composing parts
 *
 * @interface TXObj
 * @export
 */
export interface TXObj {
  /**
   * bytes representing version
   *
   * @type {number[]}
   * @memberof TXObj
   */
  version: number[]
  /**
   * the transaction inputs represented as {@link InputObj}[]
   *
   * @type {InputObj[]}
   * @memberof TXObj
   */
  inputs: InputObj[]
  tail: number[]
}
/**
 * A data structure abstracting an input of a BC transaction
 *
 * @interface InputObj
 * @export
 */
export interface InputObj {
  /**
   * the origin transaction id byte[]
   *
   * @type {number[]}
   * @memberof InputObj
   */
  tx: number[]
  /**
   * the input's index byte[]
   *
   * @type {number[]}
   * @memberof InputObj
   */
  index: number[]
  /**
   * the script byte[]
   *
   * @type {number[]}
   * @memberof InputObj
   */
  script: number[]
  /**
   * the sequence number byte[]
   *
   * @type {number[]}
   * @memberof InputObj
   */
  seq: number[]
}

/**
 * parses a raw Hex string or a number[] representing a BC transacton into a {@link TXObj}
 *
 * @param {(number[] | string)} raw
 * @returns {TXObj}
 */
export const parseTx = (raw: number[] | string): TXObj => {
  if ('string' === typeof raw) {
    raw = rawHexStringToIntArray(raw)
  }
  let _ = splitList(raw, 0)

  _ = splitList(_.tail, VERSION_LENGTH)
  const { head: version } = _

  const { res: nInputs, length: nInputsVarintLength } = decodeVarInt(_.tail)
  _ = splitList(_.tail, nInputsVarintLength)

  const inputs: InputObj[] = []
  for (let i = 0; i < nInputs; i++) {
    _ = splitList(_.tail, TX_HASH_LENGTH)
    const { head: tx } = _

    _ = splitList(_.tail, INPUT_INDEX_LENGTH)
    const { head: index } = _

    const { res: scriptLength, length: scriptLengthVarintLength } = decodeVarInt(_.tail)
    _ = splitList(_.tail, scriptLengthVarintLength)

    _ = splitList(_.tail, scriptLength)
    const { head: script } = _

    _ = splitList(_.tail, SEQ_LENGTH)
    const { head: seq } = _

    inputs.push({
      tx,
      index,
      script,
      seq
    })
  }

  return {
    version,
    inputs,
    tail: _.tail
  }
}

/**
 * encodes a {@link TXObj} into a number[] compatible with a Buffer
 *
 * @param {TXObj} txObj
 * @returns
 */
export const formatTx = (txObj: TXObj) => {
  const { version, inputs, tail } = txObj
  const flattenedInputs = inputs.reduce((acc, input) => {
    const { tx, index, script, seq } = input
    const { res: varintScriptLength } = encodeVarint(script.length)
    const flInput = tx.concat(index).concat(varintScriptLength).concat(script).concat(seq)

    return acc.concat(flInput)
  }, [] as number[])
  const { res: varintNumberOfInputs } = encodeVarint(inputs.length)

  const result = version.concat(varintNumberOfInputs).concat(flattenedInputs).concat(tail)

  return result
}
