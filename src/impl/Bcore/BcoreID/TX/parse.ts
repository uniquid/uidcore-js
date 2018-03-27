import { decodeVarInt, encodeVarint } from './varint'
const VERSION_LENGTH = 4
const TX_HASH_LENGTH = 32
const INPUT_INDEX_LENGTH = 4
const SEQ_LENGTH = 4
const splitList = <T>(list: T[], at) => ({
  head: list.slice(0, at),
  tail: list.slice(at),
})
interface TXObj {
  version: number[]
  inputs: InputObj[]
  tail: number[]
}
interface InputObj {
  tx: number[]
  index: number[]
  script: number[]
  seq: number[]
}

export const rawTxStringToIntArray = (raw: string) => {
  const rawHexStrArray: string[] = []
  let idx = 0
  while (idx < raw.length) {
    // tslint:disable-next-line:no-magic-numbers
    rawHexStrArray.push(Array.prototype.slice.call(raw, idx, (idx += 2)).join(''))
  }

  // tslint:disable-next-line:no-magic-numbers
  return rawHexStrArray.map(hex => parseInt(hex, 16))
}
const padHex = (hex: string) => (hex.length === 1 ? `0${hex}` : hex)
export const intArrayToRawTxString = (tx: number[]) =>
  tx
    // tslint:disable-next-line:no-magic-numbers
    .map(n => padHex(n.toString(16)))
    .join('')
export const parseTx = (raw: number[]): TXObj => {
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
  }, [])
  const { res: varintNumberOfInputs } = encodeVarint(inputs.length)

  return version.concat(varintNumberOfInputs).concat(flattenedInputs).concat(tail)
}
