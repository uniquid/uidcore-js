import { InputObj } from './parse';
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
    version: number[];
    /**
     * the transaction inputs represented as {@link InputObj}[]
     *
     * @type {InputObj[]}
     * @memberof TXObj
     */
    inputs: InputObj[];
    tail: number[];
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
    tx: number[];
    /**
     * the input's index byte[]
     *
     * @type {number[]}
     * @memberof InputObj
     */
    index: number[];
    /**
     * the script byte[]
     *
     * @type {number[]}
     * @memberof InputObj
     */
    script: number[];
    /**
     * the sequence number byte[]
     *
     * @type {number[]}
     * @memberof InputObj
     */
    seq: number[];
}
/**
 * parses a raw Hex string or a number[] representing a BC transacton into a {@link TXObj}
 *
 * @param {(number[] | string)} raw
 * @returns {TXObj}
 */
export declare const parseTx: (raw: string | number[]) => TXObj;
/**
 * encodes a {@link TXObj} into a number[] compatible with a Buffer
 *
 * @param {TXObj} txObj
 * @returns
 */
export declare const formatTx: (txObj: TXObj) => number[];
