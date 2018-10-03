"use strict";
/**
 * varint utils from https://github.com/chrisdickinson/varint
 */
// tslint:disable:no-magic-numbers no-bitwise
exports.__esModule = true;
exports.decodeVarInt = function (buf, offset) {
    if (offset === void 0) { offset = 0; }
    var MSB = 0x80;
    var REST = 0x7f;
    var l = buf.length;
    var res = 0;
    var shift = 0;
    var counter = offset;
    var b;
    do {
        if (counter >= l) {
            throw new RangeError('Could not decode varint');
        }
        b = buf[counter++];
        res += shift < 28 ? (b & REST) << shift : (b & REST) * Math.pow(2, shift);
        shift += 7;
    } while (b >= MSB);
    return { res: res, length: counter - offset };
};
exports.encodeVarint = function (num, offset) {
    if (offset === void 0) { offset = 0; }
    var MSB = 0x80;
    var REST = 0x7f;
    var MSBALL = ~REST;
    var INT = Math.pow(2, 31);
    var res = [];
    var oldOffset = offset;
    while (num >= INT) {
        res[offset++] = (num & 0xff) | MSB;
        num /= 128;
    }
    while (num & MSBALL) {
        res[offset++] = (num & 0xff) | MSB;
        num >>>= 7;
    }
    res[offset] = num | 0;
    return { res: res, length: offset - oldOffset + 1 };
};
// export const varIntLength = (value: number) => {
//   const N1 = Math.pow(2, 7)
//   const N2 = Math.pow(2, 14)
//   const N3 = Math.pow(2, 21)
//   const N4 = Math.pow(2, 28)
//   const N5 = Math.pow(2, 35)
//   const N6 = Math.pow(2, 42)
//   const N7 = Math.pow(2, 49)
//   const N8 = Math.pow(2, 56)
//   const N9 = Math.pow(2, 63)
//   return value < N1
//     ? 1
//     : value < N2
//       ? 2
//       : value < N3
//         ? 3
//         : value < N4 ? 4 : value < N5 ? 5 : value < N6 ? 6 : value < N7 ? 7 : value < N8 ? 8 : value < N9 ? 9 : 10
// }
