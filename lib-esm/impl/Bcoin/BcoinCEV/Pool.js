"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// import { BCTX } from './../../../../lib-esm/impl/Bcoin/BcoinCEV/Pool.d'
const parse_1 = require("./TX/parse");
// tslint:disable-next-line:no-require-imports
const Tx = require('lcoin/lib/primitives/tx');
// tslint:disable-next-line:no-require-imports
const bcoin = require('lcoin');
const BROADCAST_WAIT_BEFORE_RESPONSE = 3000;
const BROADCAST_TIMEOUT = 60000;
const WATCHADDRESS_WAIT_BEFORE_RESPONSE = 10000;
/**
 * constructs a Pool
 * @param {Options} options Options for constructing the Pool
 * @returns {Promise<BCPool>}
 */
exports.Pool = async (options) => {
    const chainLogger = new bcoin.logger({
        level: options.logLevel
    });
    const poolLogger = new bcoin.logger({
        level: options.logLevel
    });
    const chain = bcoin.chain({
        logger: chainLogger,
        db: 'leveldb',
        location: options.dbFolder,
        spv: true
    });
    const pool = new bcoin.pool({
        logger: poolLogger,
        seeds: options.seeds,
        chain,
        maxPeers: 8
    });
    await chainLogger.open();
    await poolLogger.open();
    await pool.open();
    await pool.connect();
    let unlock = pool.locker.lock();
    // tslint:disable-next-line:no-empty
    let resolve = (_) => { };
    let txs = [];
    const watchAddresses = async (addresses) => new Promise(async (_resolve, reject) => {
        Array.from(new Set(addresses)).forEach(address => pool.watchAddress(address));
        await unlock.then((_) => _());
        await pool.startSync();
        await pool.sync(true);
        resolve = _resolve;
    });
    pool.on('tx', (tx) => {
        console.log('----_TX------------');
        console.log(tx.toJSON());
        pool.watch(tx.toJSON().hash);
        console.log('-------------------');
    });
    let scheduledResponse = false;
    const listener = (block, entry) => {
        txs = txs.concat(block.txs);
        if (block.txs.length && !scheduledResponse) {
            console.log(`*BLOCK with txs: ${block.toJSON().hash}`, block.txs.map((tx) => tx.toJSON().hash), `waits ${WATCHADDRESS_WAIT_BEFORE_RESPONSE}`);
            unlock = pool.locker.lock();
            // pool.spvFilter.reset()
            // pool.unwatch()
            pool.stopSync();
            if (!scheduledResponse) {
                scheduledResponse = true;
                setTimeout(() => {
                    resolve(txs);
                    txs = [];
                    // pool.removeListener('block', listener)
                    scheduledResponse = false;
                }, WATCHADDRESS_WAIT_BEFORE_RESPONSE);
            }
        }
    };
    pool.on('block', listener);
    const broadcast = (txid, txObj) => new Promise(async (_resolve, reject) => {
        const rawTx = Buffer.from(parse_1.formatTx(txObj));
        const msg = Tx.fromRaw(rawTx);
        setTimeout(() => reject('Broadcast timeout'), BROADCAST_TIMEOUT);
        pool.broadcast(msg).then(() => setTimeout(_resolve, BROADCAST_WAIT_BEFORE_RESPONSE), reject);
    });
    return {
        watchAddresses,
        broadcast
    };
};
//# sourceMappingURL=Pool.js.map