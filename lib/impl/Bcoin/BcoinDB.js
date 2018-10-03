"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = require("fs");
var path = require("path");
var Identity_1 = require("../../types/data/Identity");
// tslint:disable-next-line:no-require-imports
var LokiConstructor = require('lokijs');
/**
 * constructs a {@link BcoinDB}
 * This implementation uses a LokiDB as persistence helper
 * @param {Options} options Options
 * @returns {Promise<BcoinDB>}
 */
exports.makeBcoinDB = function (options) {
    return new Promise(function (resolve, reject) {
        if (!fs_1.existsSync(options.home)) {
            fs_1.mkdirSync(options.home);
        }
        var db = new LokiConstructor(path.join(options.home, 'db.json'), {
            autoload: true,
            autosave: true,
            serializationMethod: 'pretty',
            autoloadCallback: autoloadCallback
        });
        function autoloadCallback() {
            var contracts = db.addCollection('contracts');
            var getImprinting = function () { return contracts.findOne({ imprinting: true }); };
            var storeImprinting = function (ctr) {
                var imprCtr = getImprinting();
                if (imprCtr) {
                    throw new TypeError('Already imprinted');
                }
                contracts.insert(ctr);
            };
            var getOrchestration = function () { return contracts.findOne({ orchestration: true }); };
            var storeOrchestration = function (ctr) {
                var orchCtr = getOrchestration();
                if (orchCtr) {
                    throw new TypeError('Already orchestrated');
                }
                contracts.insert(ctr);
            };
            var storeCtr = function (ctr) { return (contracts.insert(ctr), void 0); };
            var getLastUserContractIdentity = function () {
                return (contracts.find({ 'identity.role': Identity_1.Role.User, 'identity.ext': '0' }).sort(function (ctr1, ctr2) { return ctr2.identity.index - ctr1.identity.index; })[0] || { identity: { role: Identity_1.Role.User, index: 0 } }).identity;
            };
            var getLastProviderContractIdentity = function () {
                return (contracts.find({ 'identity.role': Identity_1.Role.Provider, 'identity.ext': '1' }).sort(function (ctr1, ctr2) { return ctr2.identity.index - ctr1.identity.index; })[0] || {
                    identity: { role: Identity_1.Role.Provider, index: -1 }
                }).identity;
            };
            var getActiveRoleContracts = function () {
                return contracts.find({
                    revoked: null,
                    orchestration: { $ne: true }
                });
            };
            var revokeContract = function (revoker) {
                var ctr = contracts.findOne({
                    revoked: null,
                    revoker: revoker,
                    orchestration: { $ne: true }
                });
                ctr.revoked = new Date().valueOf();
                contracts.update(ctr);
            };
            var getPayload = function (absId) {
                return [contracts.findOne({ identity: absId })].map(function (ctr) { return ctr.payload; })[0];
            };
            var getContractForExternalUser = function (userAddr) {
                return contracts.findOne({
                    'identity.role': Identity_1.Role.Provider,
                    contractor: userAddr,
                    revoked: null
                });
            };
            var findContractsWithUnresolvedProviderNames = function () {
                return contracts.find({
                    'identity.role': Identity_1.Role.User,
                    providerName: null
                });
            };
            var setProviderName = function (providerAddress, providerName) {
                contracts.findAndUpdate({ 'identity.role': Identity_1.Role.User, contractor: providerAddress }, function (userContract) { return (userContract.providerName = providerName); });
            };
            var findUserContractsByProviderName = function (providerName) {
                return contracts.find({ 'identity.role': Identity_1.Role.User, providerName: providerName });
            };
            var bcoinDB = {
                findUserContractsByProviderName: findUserContractsByProviderName,
                getContractForExternalUser: getContractForExternalUser,
                storeImprinting: storeImprinting,
                getImprinting: getImprinting,
                storeOrchestration: storeOrchestration,
                getOrchestration: getOrchestration,
                storeCtr: storeCtr,
                getLastUserContractIdentity: getLastUserContractIdentity,
                getLastProviderContractIdentity: getLastProviderContractIdentity,
                getActiveRoleContracts: getActiveRoleContracts,
                revokeContract: revokeContract,
                getPayload: getPayload,
                findContractsWithUnresolvedProviderNames: findContractsWithUnresolvedProviderNames,
                setProviderName: setProviderName
            };
            resolve(bcoinDB);
        }
    });
};
//# sourceMappingURL=BcoinDB.js.map