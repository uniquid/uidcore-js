"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const parse_1 = require("./TX/parse");
// tslint:disable-next-line:no-require-imports
const Tx = require('bcoin/lib/primitives/tx');
// tslint:disable-next-line:no-require-imports
const bcoin = require('bcoin');
bcoin.networks.uq = Object.assign({}, bcoin.networks.regtest, {
    port: 19000,
    addressPrefix: bcoin.networks.testnet.addressPrefix,
    keyPrefix: Object.assign({}, bcoin.networks.testnet.keyPrefix, {
        coinType: 0
    })
});
bcoin.set('uq');
const BROADCAST_WAIT_BEFORE_RESPONSE = 3000;
const BROADCAST_TIMEOUT = 60000;
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
    const chain = bcoin.chain({ logger: chainLogger, db: 'leveldb', location: options.dbFolder, spv: true });
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
    const watchAddresses = async (addresses) => new Promise((resolve, reject) => {
        addresses.forEach(address => pool.watchAddress(address));
        const listener = (block, entry) => {
            // console.log(`BLOCK: ${block.toJSON().hash}`, block.txs)
            if (block.txs.length) {
                pool.stopSync();
                // pool.disconnect()
                // pool.close()
                pool.unwatch();
                pool.removeListener('block', listener);
                resolve(block.txs);
            }
        };
        pool.on('block', listener);
        pool.startSync();
        pool.sync(true);
    });
    const broadcast = (txid, txObj) => new Promise(async (resolve, reject) => {
        const rawTx = Buffer.from(parse_1.formatTx(txObj));
        const msg = Tx.fromRaw(rawTx);
        setTimeout(() => reject('Broadcast timeout'), BROADCAST_TIMEOUT);
        pool.broadcast(msg).then(() => setTimeout(resolve, BROADCAST_WAIT_BEFORE_RESPONSE), reject);
    });
    return {
        watchAddresses,
        broadcast
    };
};
//# sourceMappingURL=Pool.js.map