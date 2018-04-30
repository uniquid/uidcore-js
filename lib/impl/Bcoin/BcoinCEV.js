"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var path = require("path");
var CtrManager_1 = require("./BcoinCEV/CtrManager");
var Pool_1 = require("./BcoinCEV/Pool");
var sign_1 = require("./BcoinCEV/TX/sign");
/**
 * constructs a {@link BcoinCEV}
 * @param {BcoinDB} db a BcoinDB instance
 * @param {BcoinID} id a BcoinID instance
 * @param {Options} options Options
 * @returns {BcoinCEV}
 */
exports.makeBcoinCEV = function (db, id, options) {
    var poolPromise = Pool_1.Pool({
        dbFolder: path.join(options.home, 'chain.db'),
        logLevel: options.logLevel,
        seeds: options.seeds
    });
    poolPromise
        .then(function (pool) { return CtrManager_1.startContractManager(db, id, pool, options.watchahead, options.providerNameResolver); })
        .catch(function (err) { return console.log('makeBcoinCEV ERROR', err); });
    var signRawTransaction = function (txString, paths) {
        var _a = sign_1.transactionSigner(id, txString, paths), signedTxObj = _a.signedTxObj, txid = _a.txid;
        return poolPromise.then(function (pool) { return pool.broadcast(txid, signedTxObj); }).then(function () { return txid; });
    };
    return {
        signRawTransaction: signRawTransaction
    };
};
//# sourceMappingURL=BcoinCEV.js.map