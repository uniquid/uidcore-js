"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const CtrManager_1 = require("./BcoinCEV/CtrManager");
const Pool_1 = require("./BcoinCEV/Pool");
const sign_1 = require("./BcoinCEV/TX/sign");
/**
 * constructs a {@link BcoinCEV}
 * @param {BcoinDB} db a BcoinDB instance
 * @param {BcoinID} id a BcoinID instance
 * @param {Options} options Options
 * @returns {BcoinCEV}
 */
exports.makeBcoinCEV = (db, id, options) => {
    const poolPromise = Pool_1.Pool({
        dbFolder: path.join(options.home, 'chain.db'),
        logLevel: options.logLevel,
        seeds: options.seeds
    });
    poolPromise
        .then(pool => CtrManager_1.startContractManager(db, id, pool, options.watchahead, options.providerNameResolver))
        .catch(err => console.log('makeBcoinCEV ERROR', err));
    const signRawTransaction = (txString, paths) => {
        const { signedTxObj, txid } = sign_1.transactionSigner(id, txString, paths);
        return poolPromise.then(pool => pool.broadcast(txid, signedTxObj)).then(() => txid);
    };
    return {
        signRawTransaction
    };
};
//# sourceMappingURL=BcoinCEV.js.map