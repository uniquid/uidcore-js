import { rawHexStringToIntArray } from './../../utils/hex'
import { decodeVarInt, encodeVarint } from './varint'
const VERSION_LENGTH = 4
const TX_HASH_LENGTH = 32
const INPUT_INDEX_LENGTH = 4
const SEQ_LENGTH = 4
const splitList = <T>(list: T[], at: number) => ({
  head: list.slice(0, at),
  tail: list.slice(at),
})
export interface TXObj {
  version: number[]
  inputs: InputObj[]
  tail: number[]
}
export interface InputObj {
  tx: number[]
  index: number[]
  script: number[]
  seq: number[]
}

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
      seq,
    })
  }

  return {
    version,
    inputs,
    tail: _.tail,
  }
}

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
