"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var parse_1 = require("./TX/parse");
// tslint:disable-next-line:no-require-imports
var Tx = require('bcoin/lib/primitives/tx');
// tslint:disable-next-line:no-require-imports
var bcoin = require('bcoin');
bcoin.networks.uq = Object.assign({}, bcoin.networks.regtest, {
    port: 19000,
    addressPrefix: bcoin.networks.testnet.addressPrefix,
    keyPrefix: Object.assign({}, bcoin.networks.testnet.keyPrefix, {
        coinType: 0
    })
});
bcoin.set('uq');
var BROADCAST_WAIT_BEFORE_RESPONSE = 3000;
var BROADCAST_TIMEOUT = 60000;
/**
 * constructs a Pool
 * @param {Options} options Options for constructing the Pool
 * @returns {Promise<BCPool>}
 */
exports.Pool = function (options) { return __awaiter(_this, void 0, void 0, function () {
    var _this = this;
    var chainLogger, poolLogger, chain, pool, watchAddresses, broadcast;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                chainLogger = new bcoin.logger({
                    level: options.logLevel
                });
                poolLogger = new bcoin.logger({
                    level: options.logLevel
                });
                chain = bcoin.chain({ logger: chainLogger, db: 'leveldb', location: options.dbFolder, spv: true });
                pool = new bcoin.pool({
                    logger: poolLogger,
                    seeds: options.seeds,
                    chain: chain,
                    maxPeers: 8
                });
                return [4 /*yield*/, chainLogger.open()];
            case 1:
                _a.sent();
                return [4 /*yield*/, poolLogger.open()];
            case 2:
                _a.sent();
                return [4 /*yield*/, pool.open()];
            case 3:
                _a.sent();
                return [4 /*yield*/, pool.connect()];
            case 4:
                _a.sent();
                watchAddresses = function (addresses) { return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        return [2 /*return*/, new Promise(function (resolve, reject) {
                                addresses.forEach(function (address) { return pool.watchAddress(address); });
                                var listener = function (block, entry) {
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
                            })];
                    });
                }); };
                broadcast = function (txid, txObj) {
                    return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        var rawTx, msg;
                        return __generator(this, function (_a) {
                            rawTx = Buffer.from(parse_1.formatTx(txObj));
                            msg = Tx.fromRaw(rawTx);
                            setTimeout(function () { return reject('Broadcast timeout'); }, BROADCAST_TIMEOUT);
                            pool.broadcast(msg).then(function () { return setTimeout(resolve, BROADCAST_WAIT_BEFORE_RESPONSE); }, reject);
                            return [2 /*return*/];
                        });
                    }); });
                };
                return [2 /*return*/, {
                        watchAddresses: watchAddresses,
                        broadcast: broadcast
                    }];
        }
    });
}); };
//# sourceMappingURL=Pool.js.map