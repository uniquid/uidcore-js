import { ProviderNameResolver } from './BcoinCEV/CtrManager';
import { BcoinCEV } from './types/BcoinCEV';
import { BcoinDB } from './types/BcoinDB';
import { BcoinID } from './types/BcoinID';
/**
 * Options for constructing a {@link BcoinCEV}
 * @interface Options
 * @export
 */
export interface Options {
    /**
     * absolute path to the {@link BcoinCEV} home folder for file persistence
     * @type {string}
     * @memberof Options
     */
    home: string;
    /**
     * an array of Bitcoin Full Nodes' IPs
     * used as initial seeds for the BC network
     * @type {string[]}
     * @memberof Options
     */
    seeds: string[];
    /**
     * HOW many BIP32 address indexes, (as User|Provider) to watch ahead (Bitcoin wallet style)
     * @type {number}
     * @memberof Options
     */
    watchahead: number;
    /**
     * A service that resolves the provider's name by it's address
     * @type {ProviderNameResolver}
     * @memberof Options
     */
    providerNameResolver: ProviderNameResolver;
    logLevel: 'error' | 'warning' | 'info' | 'debug' | 'spam';
    /**
     * the bcoin logger
     * @type {string}
     * @memberof Options
     */
    logger: any;
}
/**
 * constructs a {@link BcoinCEV}
 * @param {BcoinDB} db a BcoinDB instance
 * @param {BcoinID} id a BcoinID instance
 * @param {Options} options Options
 * @returns {BcoinCEV}
 */
export declare const makeBcoinCEV: (db: BcoinDB, id: BcoinID, options: Options) => Promise<BcoinCEV>;
