export const rawHexStringToIntArray = (raw: string) => {
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
export const intArrayToRawHexString = (tx: number[]) =>
  tx
    // tslint:disable-next-line:no-magic-numbers
    .map(n => padHex(n.toString(16)))
    .join('')
