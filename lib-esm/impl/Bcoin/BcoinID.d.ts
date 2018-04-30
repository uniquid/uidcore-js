import { BcoinID } from './types/BcoinID';
/**
 * Options for constructing a {@link BcoinID}
 * @interface Options
 * @export
 */
export interface Options {
    /**
     * absolute path to the {@link BcoinID} home folder for file persistence
     * @type {string}
     * @memberof Options
     */
    home: string;
}
/**
 * constructs a {@link BcoinID}
 * @param {Options} options Options
 * @returns {Promise<BcoinID>}
 */
export declare const makeBcoinID: (options: Options) => Promise<BcoinID>;
