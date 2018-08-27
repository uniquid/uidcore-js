"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var path = require("path");
var BcoinCEV_1 = require("../Bcoin/BcoinCEV");
var httpRegistry_1 = require("../Bcoin/BcoinCEV/providerNameResolvers/httpRegistry");
var BcoinDB_1 = require("../Bcoin/BcoinDB");
var BcoinID_1 = require("../Bcoin/BcoinID");
var RPC_1 = require("../RPC/BitmaskBcoin/RPC");
var message_1 = require("./message");
var nodename_1 = require("./nodename");
exports.DEFAULT_ANNOUNCE_TOPIC = 'UIDLitecoin/announce';
exports.DEFAULT_RPC_TIMEOUT = 10000;
exports.standardUQNodeFactory = function (_a) {
    var home = _a.home, mqttHost = _a.mqttHost, bcSeeds = _a.bcSeeds, rpcHandlers = _a.rpcHandlers, registryUrl = _a.registryUrl, _b = _a.requestTimeout, requestTimeout = _b === void 0 ? exports.DEFAULT_RPC_TIMEOUT : _b, _c = _a.announceTopic, announceTopic = _c === void 0 ? exports.DEFAULT_ANNOUNCE_TOPIC : _c, _d = _a.nodenamePrefix, nodenamePrefix = _d === void 0 ? '' : _d;
    console.log(mqttHost, announceTopic, bcSeeds, registryUrl);
    var dbOpts = { home: path.join(home, 'DB') };
    var dbProm = BcoinDB_1.makeBcoinDB(dbOpts);
    var idOpts = { home: path.join(home, 'ID') };
    var idProm = BcoinID_1.makeBcoinID(idOpts);
    return Promise.all([dbProm, idProm]).then(function (_a) {
        var db = _a[0], id = _a[1];
        var cevOpts = {
            home: path.join(home, 'CEV'),
            logLevel: 'debug',
            seeds: bcSeeds,
            watchahead: 10,
            providerNameResolver: httpRegistry_1.fromHTTPRegistry(registryUrl)
        };
        var nodenameOpts = { home: path.join(home, 'NODENAME'), prefix: nodenamePrefix };
        var nodename = nodename_1.getNodeName(nodenameOpts);
        var announceMessage = { topic: announceTopic, data: { name: nodename, xpub: id.getBaseXpub() } };
        var cev = BcoinCEV_1.makeBcoinCEV(db, id, cevOpts);
        var rpc = RPC_1.makeRPC(cev, db, id);
        var identityFor = id.identityFor;
        var msgs = message_1.messages({ identityFor: identityFor, announceMessage: announceMessage, mqttHost: mqttHost, rpc: rpc, rpcHandlers: rpcHandlers, requestTimeout: requestTimeout });
        return {
            msgs: msgs,
            cev: cev,
            id: id,
            db: db,
            nodename: nodename
        };
    });
};
//# sourceMappingURL=factory.js.map