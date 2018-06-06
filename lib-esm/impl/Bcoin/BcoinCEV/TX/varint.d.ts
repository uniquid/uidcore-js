/**
 * varint utils from https://github.com/chrisdickinson/varint
 */
export declare const decodeVarInt: (buf: number[], offset?: number) => {
    res: number;
    length: number;
};
export declare const encodeVarint: (num: number, offset?: number) => {
    res: number[];
    length: number;
};
