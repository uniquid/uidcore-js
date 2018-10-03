"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const BcoinCEV_1 = require("../Bcoin/BcoinCEV");
const httpRegistry_1 = require("../Bcoin/BcoinCEV/providerNameResolvers/httpRegistry");
const BcoinDB_1 = require("../Bcoin/BcoinDB");
const BcoinID_1 = require("../Bcoin/BcoinID");
const RPC_1 = require("../RPC/BitmaskBcoin/RPC");
const message_1 = require("./message");
const nodename_1 = require("./nodename");
exports.DEFAULT_ANNOUNCE_TOPIC = 'UIDLitecoin/announce';
exports.DEFAULT_RPC_TIMEOUT = 10000;
exports.standardUQNodeFactory = ({ home, mqttHost, bcSeeds, rpcHandlers, registryUrl, requestTimeout = exports.DEFAULT_RPC_TIMEOUT, announceTopic = exports.DEFAULT_ANNOUNCE_TOPIC, nodenamePrefix = '', network }) => {
    console.log(mqttHost, announceTopic, bcSeeds, registryUrl);
    const dbOpts = { home: path.join(home, 'DB') };
    const dbProm = BcoinDB_1.makeBcoinDB(dbOpts);
    const idOpts = { home: path.join(home, 'ID'), network };
    const idProm = BcoinID_1.makeBcoinID(idOpts);
    return Promise.all([dbProm, idProm]).then(([db, id]) => {
        const cevOpts = {
            home: path.join(home, 'CEV'),
            logLevel: 'debug',
            seeds: bcSeeds,
            watchahead: 10,
            providerNameResolver: httpRegistry_1.fromHTTPRegistry(registryUrl)
        };
        const nodenameOpts = {
            home: path.join(home, 'NODENAME'),
            prefix: nodenamePrefix
        };
        const nodename = nodename_1.getNodeName(nodenameOpts);
        const announceMessage = {
            topic: announceTopic,
            data: { name: nodename, xpub: id.getBaseXpub() }
        };
        const cev = BcoinCEV_1.makeBcoinCEV(db, id, cevOpts);
        const rpc = RPC_1.makeRPC(cev, db, id);
        const { identityFor } = id;
        const msgs = message_1.messages({
            identityFor,
            announceMessage,
            mqttHost,
            rpc,
            rpcHandlers,
            requestTimeout
        });
        return {
            msgs,
            cev,
            id,
            db,
            nodename
        };
    });
};
//# sourceMappingURL=factory.js.map