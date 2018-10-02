"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path = require("path");
const Identity_1 = require("../../types/data/Identity");
// tslint:disable-next-line:no-require-imports
const LokiConstructor = require('lokijs');
/**
 * constructs a {@link BcoinDB}
 * This implementation uses a LokiDB as persistence helper
 * @param {Options} options Options
 * @returns {Promise<BcoinDB>}
 */
exports.makeBcoinDB = (options) => new Promise((resolve, reject) => {
    if (!fs_1.existsSync(options.home)) {
        fs_1.mkdir(options.home);
    }
    const db = new LokiConstructor(path.join(options.home, 'db.json'), {
        autoload: true,
        autosave: true,
        serializationMethod: 'pretty',
        autoloadCallback
    });
    function autoloadCallback() {
        const contracts = db.addCollection('contracts');
        const getImprinting = () => contracts.findOne({ imprinting: true });
        const storeImprinting = (ctr) => {
            const imprCtr = getImprinting();
            if (imprCtr) {
                throw new TypeError('Already imprinted');
            }
            contracts.insert(ctr);
        };
        const getOrchestration = () => contracts.findOne({ orchestration: true });
        const storeOrchestration = (ctr) => {
            const orchCtr = getOrchestration();
            if (orchCtr) {
                throw new TypeError('Already orchestrated');
            }
            contracts.insert(ctr);
        };
        const storeCtr = (ctr) => (contracts.insert(ctr), void 0);
        const getLastUserContractIdentity = () => (contracts.find({ 'identity.role': Identity_1.Role.User, 'identity.ext': '0' }).sort((ctr1, ctr2) => ctr2.identity.index - ctr1.identity.index)[0] || { identity: { role: Identity_1.Role.User, index: 0 } }).identity;
        const getLastProviderContractIdentity = () => (contracts.find({ 'identity.role': Identity_1.Role.Provider, 'identity.ext': '1' }).sort((ctr1, ctr2) => ctr2.identity.index - ctr1.identity.index)[0] || { identity: { role: Identity_1.Role.Provider, index: -1 } }).identity;
        const getActiveRoleContracts = () => contracts.find({
            revoked: null,
            orchestration: { $ne: true }
        });
        const revokeContract = (revoker) => {
            const ctr = contracts.findOne({ revoked: null, revoker, orchestration: { $ne: true } });
            ctr.revoked = new Date().valueOf();
            contracts.update(ctr);
        };
        const getPayload = (absId) => [contracts.findOne({ identity: absId })].map(ctr => ctr.payload)[0];
        const getContractForExternalUser = (userAddr) => contracts.findOne({ 'identity.role': Identity_1.Role.Provider, contractor: userAddr, revoked: null });
        const findContractsWithUnresolvedProviderNames = () => contracts.find({ 'identity.role': Identity_1.Role.User, providerName: null });
        const setProviderName = (providerAddress, providerName) => {
            contracts.findAndUpdate({ 'identity.role': Identity_1.Role.User, contractor: providerAddress }, (userContract) => (userContract.providerName = providerName));
        };
        const findUserContractsByProviderName = (providerName) => contracts.find({ 'identity.role': Identity_1.Role.User, providerName });
        const bcoinDB = {
            findUserContractsByProviderName,
            getContractForExternalUser,
            storeImprinting,
            getImprinting,
            storeOrchestration,
            getOrchestration,
            storeCtr,
            getLastUserContractIdentity,
            getLastProviderContractIdentity,
            getActiveRoleContracts,
            revokeContract,
            getPayload,
            findContractsWithUnresolvedProviderNames,
            setProviderName
        };
        resolve(bcoinDB);
    }
});
//# sourceMappingURL=BcoinDB.js.map