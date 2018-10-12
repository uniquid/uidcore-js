/**!
 *
 * Copyright 2016-2018 Uniquid Inc. or its affiliates. All Rights Reserved.
 *
 * License is in the "LICENSE" file accompanying this file.
 * See the License for the specific language governing permissions and limitations under the License.
 *
 */
import { IdAddress } from '../../../types/data/Identity';
import { TXObj } from './TX/parse';
/**
 * Options for constructing a BCPool
 * @interface Options
 * @export
 */
export interface Options {
    /**
     * an array of Bitcoin Full Nodes' IPs
     * used as initial seeds for the BC network
     * @type {string[]}
     * @memberof Options
     */
    seeds: string[];
    /**
     * absolute path to folder for BC's Spv Storage
     * @type {string}
     * @memberof Options
     */
    dbFolder: string;
    /**
     * the bcoin loggers
     * @type {string}
     * @memberof Options
     */
    logger: any;
}
/**
 * A Bcoin Pool wrapper for UQ {@link BcoinCEV} it handles Bitcoin Network net communication and exposes UQ related necessary functions
 * @interface BCPool
 * @export
 */
export interface BCPool {
    /**
     * When invoked, the pool is set in sync mode and waits for a block containing transactions involving the provided adrresses
     *
     * When such a block is being notified from network, transactions are resolved on the returning Promise
     *
     * The pool is then set asleep, unwatching everything and stopping sync
     * @param {IdAddress[]} addresses the addresses to be watched
     * @returns {Promise<BCTX[]>} a Promise of Transactions (Bcoin lib TX objects)
     * @memberof BCPool
     */
    watchAddresses(addresses: IdAddress[]): Promise<BCTX[]>;
    /**
     * Broadcasts a transaction to the network
     * @param {string} txid the transaction ID
     * @param {TXObj} txObj the {@link TXObj} representing the transaction
     * @returns {Promise<void>} The promise is rejected on BROADCAST_TIMEOUT(60secs), and on error occourring during broadcast
     *
     * if broadcasting succeeds BROADCAST_WAIT_BEFORE_RESPONSE(3secs) are waited before resolving Promise, to let the mempools digest the newly broadcasted TX
     * @memberof BCPool
     */
    broadcast(txid: string, txObj: TXObj): Promise<void>;
}
/**
 * constructs a Pool
 * @param {Options} options Options for constructing the Pool
 * @returns {Promise<BCPool>}
 */
export declare const Pool: (options: Options) => Promise<BCPool>;
export interface BCTX {
    [k: string]: any;
}
