"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
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
var txContracts_1 = require("./TX/txContracts");
var loopRoleContractWatch = function (db, pool, id, watchahead, onContracts, logger) { return __awaiter(_this, void 0, void 0, function () {
    var _nextWatchIdentities, nextWatchIdentities, nextWatchAddresses, watchingRevokingAddresses, txs, newContracts, revokingAddresses;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _nextWatchIdentities = [db.getLastProviderContractIdentity(), db.getLastUserContractIdentity()]
                    .map(function (lastIdentity) {
                    var identities = [];
                    for (var offset = 1; offset <= watchahead; offset++) {
                        var waIdentity = id.identityFor(__assign({}, lastIdentity, { index: lastIdentity.index + offset }));
                        identities.push(waIdentity);
                    }
                    return identities;
                })
                    .reduce(function (a, b) { return a.concat(b); });
                nextWatchIdentities = Array.from(new Set(_nextWatchIdentities));
                nextWatchAddresses = nextWatchIdentities.map(function (identity) { return identity.address; });
                watchingRevokingAddresses = db.getActiveRoleContracts().map(function (ctr) { return ctr.revoker; });
                logger.debug("watchingRevokingAddresses: ", watchingRevokingAddresses.reduce(function (s, a, i) { return s + "\n" + i + " : " + a; }, ''));
                logger.debug("nextWatchAddresses: ", nextWatchAddresses.reduce(function (s, a, i) { return s + "\n" + i + " : " + a; }, ''));
                return [4 /*yield*/, pool.watchAddresses(nextWatchAddresses.concat(watchingRevokingAddresses))];
            case 1:
                txs = _a.sent();
                newContracts = txContracts_1.getRoleContracts(nextWatchIdentities, txs);
                logger.info("\n++NEW Role Contracts: " + newContracts.length + " ");
                logger.debug(newContracts.reduce(function (s, c) { return "" + s + c.identity.role + "[" + c.identity.index + "] -> " + c.contractor + "\n"; }, ''));
                newContracts.forEach(db.storeCtr);
                revokingAddresses = txContracts_1.getRevokingAddresses(watchingRevokingAddresses, txs);
                logger.debug("\n--REVOKING Addresses: " + revokingAddresses.length);
                logger.debug(revokingAddresses.reduce(function (s, a) { return "" + s + a + "\n"; }, ''));
                revokingAddresses.forEach(db.revokeContract);
                onContracts(newContracts, revokingAddresses);
                loopRoleContractWatch(db, pool, id, watchahead, onContracts, logger).catch(function (err) {
                    return logger.error('loopRoleContractWatch ERROR:', err);
                });
                return [2 /*return*/];
        }
    });
}); };
var ensureImprinting = function (db, id, pool, logger) { return __awaiter(_this, void 0, void 0, function () {
    var shallBeImprintingContract, imprintingAddress, txs;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                shallBeImprintingContract = db.getImprinting();
                imprintingAddress = id.getImprintingAddress();
                logger.info("---------------------------------------------------------- IMPR (" + imprintingAddress + ") ", shallBeImprintingContract);
                _a.label = 1;
            case 1:
                if (!!shallBeImprintingContract) return [3 /*break*/, 3];
                return [4 /*yield*/, pool.watchAddresses([imprintingAddress])];
            case 2:
                txs = _a.sent();
                logger.info("---------------------------------------------------------- got IMPR " + imprintingAddress, txs);
                shallBeImprintingContract = txContracts_1.convertToImprintingContract(imprintingAddress, txs);
                if (shallBeImprintingContract) {
                    db.storeImprinting(shallBeImprintingContract);
                }
                return [3 /*break*/, 1];
            case 3: return [2 /*return*/, shallBeImprintingContract];
        }
    });
}); };
var ensureOrchestration = function (db, id, pool, logger) { return function (imprintingContract) { return __awaiter(_this, void 0, void 0, function () {
    var shallBeOrchestrationContract, orchestrationAddress, txs;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                shallBeOrchestrationContract = db.getOrchestration();
                orchestrationAddress = id.getOrchestrateAddress();
                _a.label = 1;
            case 1:
                if (!!shallBeOrchestrationContract) return [3 /*break*/, 3];
                logger.info("---------------------------------------------------------- ORCH (" + orchestrationAddress + ") ", shallBeOrchestrationContract);
                return [4 /*yield*/, pool.watchAddresses([orchestrationAddress])];
            case 2:
                txs = _a.sent();
                logger.info("---------------------------------------------------------- got ORCH " + orchestrationAddress, txs);
                shallBeOrchestrationContract = txContracts_1.convertToOrchestrationContract(imprintingContract, orchestrationAddress, txs);
                if (shallBeOrchestrationContract) {
                    db.storeOrchestration(shallBeOrchestrationContract);
                    db.revokeContract(imprintingContract.revoker);
                }
                return [3 /*break*/, 1];
            case 3: return [2 /*return*/, shallBeOrchestrationContract];
        }
    });
}); }; };
var providerNameProcess = function (db, providerNameResolver, logger) {
    var contractsWithUnresolvedProviderNames = [];
    var trigger = function () {
        contractsWithUnresolvedProviderNames = db.findContractsWithUnresolvedProviderNames();
        next();
    };
    return {
        trigger: trigger
    };
    function next() {
        var contract = contractsWithUnresolvedProviderNames.shift();
        if (contract) {
            var providerAddress_1 = contract.contractor;
            providerNameResolver(providerAddress_1)
                .then(function (providerName) { return db.setProviderName(providerAddress_1, providerName); })
                .catch(function (error) {
                logger.error("ProviderNameResolver [" + providerAddress_1 + "] Error", error);
                // tslint:disable-next-line:no-magic-numbers
                setTimeout(trigger, 10000);
            });
        }
    }
};
/**
 * This starts the {@link BcoinCEV} main lifecycle process,
 * when started it ensures node imprinting contract, then ensures node orchestration contract
 *
 * Ensureness is guaranteed by the presence of contracts in the {@link BcoinDB} persistence
 * if not present pool should watch on respective {@link IdAddress addresses} waiting for contracts to come
 *
 * Then it loops in watching for node's user and provider {@link IdAddress}es for respective {@link Contract}s
 * @param {BcoinDB} db a BcoinDB instance
 * @param {BcoinID} id a BcoinID instance
 * @param {BCPool} pool a BCPool instance
 * @param {number} watchahead how many {@link IdAddress} to watch ahead the latest BIP32 index on user and provider {@link Contract}
 * @param {ProviderNameResolver} providerNameResolver
 */
exports.startContractManager = function (db, id, pool, watchahead, providerNameResolver, logger) { return __awaiter(_this, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, ensureImprinting(db, id, pool, logger).then(ensureOrchestration(db, id, pool, logger)).then(function () {
                var trigger = providerNameProcess(db, providerNameResolver, logger).trigger;
                loopRoleContractWatch(db, pool, id, watchahead, trigger, logger).catch(function (err) {
                    return logger.error('loopRoleContractWatch ERROR:', err);
                });
                trigger();
            })];
    });
}); };
//# sourceMappingURL=CtrManager.js.map