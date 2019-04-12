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
/**!
 *
 * Copyright 2016-2018 Uniquid Inc. or its affiliates. All Rights Reserved.
 *
 * License is in the "LICENSE" file accompanying this file.
 * See the License for the specific language governing permissions and limitations under the License.
 *
 */
var path = require("path");
var BcoinCEV_1 = require("../Bcoin/BcoinCEV");
var httpRegistry_1 = require("../Bcoin/BcoinCEV/providerNameResolvers/httpRegistry");
var BcoinDB_1 = require("../Bcoin/BcoinDB");
var BcoinID_1 = require("../Bcoin/BcoinID");
var RPC_1 = require("../RPC/BitmaskBcoin/RPC");
var message_1 = require("./message");
var nodename_1 = require("./nodename");
// tslint:disable-next-line:no-require-imports
var bcoin = require('lcoin');
exports.DEFAULT_ANNOUNCE_TOPIC = 'UIDLitecoin/announce';
exports.DEFAULT_RPC_TIMEOUT = 10000;
exports.standardUQNodeFactory = function (_a) {
    var home = _a.home, mqttHost = _a.mqttHost, bcSeeds = _a.bcSeeds, rpcHandlers = _a.rpcHandlers, registryUrl = _a.registryUrl, _b = _a.requestTimeout, requestTimeout = _b === void 0 ? exports.DEFAULT_RPC_TIMEOUT : _b, _c = _a.announceTopic, announceTopic = _c === void 0 ? exports.DEFAULT_ANNOUNCE_TOPIC : _c, _d = _a.nodenamePrefix, nodenamePrefix = _d === void 0 ? '' : _d, network = _a.network, _e = _a.bcLogLevel, bcLogLevel = _e === void 0 ? 'info' : _e;
    return __awaiter(_this, void 0, void 0, function () {
        var _this = this;
        var logger, dbOpts, dbProm, idOpts, idProm;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    logger = new bcoin.logger({
                        level: bcLogLevel,
                        filename: path.join(home, 'log')
                    });
                    return [4 /*yield*/, logger.open()];
                case 1:
                    _f.sent();
                    dbOpts = { home: path.join(home, 'DB') };
                    dbProm = BcoinDB_1.makeBcoinDB(dbOpts);
                    idOpts = { home: path.join(home, 'ID'), network: network };
                    idProm = BcoinID_1.makeBcoinID(idOpts);
                    return [2 /*return*/, Promise.all([dbProm, idProm]).then(function (_a) {
                            var db = _a[0], id = _a[1];
                            return __awaiter(_this, void 0, void 0, function () {
                                var cevOpts, nodenameOpts, nodename, announceMessage, cev, rpc, identityFor, msgs;
                                return __generator(this, function (_b) {
                                    switch (_b.label) {
                                        case 0:
                                            cevOpts = {
                                                home: path.join(home, 'CEV'),
                                                logLevel: bcLogLevel,
                                                seeds: bcSeeds,
                                                watchahead: 10,
                                                providerNameResolver: httpRegistry_1.fromHTTPRegistry(registryUrl),
                                                logger: logger
                                            };
                                            nodenameOpts = {
                                                home: path.join(home, 'NODENAME'),
                                                prefix: nodenamePrefix
                                            };
                                            nodename = nodename_1.getNodeName(nodenameOpts);
                                            announceMessage = {
                                                topic: announceTopic,
                                                data: { name: nodename, xpub: id.getBaseXpub() }
                                            };
                                            return [4 /*yield*/, BcoinCEV_1.makeBcoinCEV(db, id, cevOpts)];
                                        case 1:
                                            cev = _b.sent();
                                            rpc = RPC_1.makeRPC(cev, db, id);
                                            identityFor = id.identityFor;
                                            msgs = message_1.messages({
                                                identityFor: identityFor,
                                                announceMessage: announceMessage,
                                                mqttHost: mqttHost,
                                                rpc: rpc,
                                                rpcHandlers: rpcHandlers,
                                                requestTimeout: requestTimeout,
                                                logger: logger
                                            });
                                            return [2 /*return*/, {
                                                    msgs: msgs,
                                                    cev: cev,
                                                    id: id,
                                                    db: db,
                                                    nodename: nodename
                                                }];
                                    }
                                });
                            });
                        })];
            }
        });
    });
};
//# sourceMappingURL=factory.js.map