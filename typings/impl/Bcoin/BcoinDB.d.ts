import { BcoinDB } from './types/BcoinDB';
/**
 * Options for constructing a {@link BcoinDB}
 * @interface Options
 * @export
 */
export interface Options {
    /**
     * absolute path to the {@link BcoinDB} home folder for file persistence
     * @type {string}
     * @memberof Options
     */
    home: string;
}
/**
 * constructs a {@link BcoinDB}
 * This implementation uses a LokiDB as persistence helper
 * @param {Options} options Options
 * @returns {Promise<BcoinDB>}
 */
export declare const makeBcoinDB: (options: Options) => Promise<BcoinDB>;
