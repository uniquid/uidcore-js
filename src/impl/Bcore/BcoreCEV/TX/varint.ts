/**
 * varint utils from https://github.com/chrisdickinson/varint
 */
// tslint:disable:no-magic-numbers no-bitwise

export const decodeVarInt = (buf: number[], offset = 0) => {
  const MSB = 0x80
  const REST = 0x7f
  const l = buf.length
  let res = 0
  let shift = 0
  let counter = offset
  let b

  do {
    if (counter >= l) {
      throw new RangeError('Could not decode varint')
    }
    b = buf[counter++]
    res += shift < 28 ? (b & REST) << shift : (b & REST) * Math.pow(2, shift)
    shift += 7
  } while (b >= MSB)

  return { res, length: counter - offset }
}

export const encodeVarint = (num: number, offset = 0) => {
  const MSB = 0x80
  const REST = 0x7f
  const MSBALL = ~REST
  const INT = Math.pow(2, 31)
  const res = []
  const oldOffset = offset

  while (num >= INT) {
    res[offset++] = (num & 0xff) | MSB
    num /= 128
  }
  while (num & MSBALL) {
    res[offset++] = (num & 0xff) | MSB
    num >>>= 7
  }
  res[offset] = num | 0

  return { res, length: offset - oldOffset + 1 }
}

export const varIntLength = (value: number) => {
  const N1 = Math.pow(2, 7)
  const N2 = Math.pow(2, 14)
  const N3 = Math.pow(2, 21)
  const N4 = Math.pow(2, 28)
  const N5 = Math.pow(2, 35)
  const N6 = Math.pow(2, 42)
  const N7 = Math.pow(2, 49)
  const N8 = Math.pow(2, 56)
  const N9 = Math.pow(2, 63)

  return value < N1
    ? 1
    : value < N2
      ? 2
      : value < N3
        ? 3
        : value < N4 ? 4 : value < N5 ? 5 : value < N6 ? 6 : value < N7 ? 7 : value < N8 ? 8 : value < N9 ? 9 : 10
}
