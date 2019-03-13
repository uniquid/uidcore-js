"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var Identity_1 = require("./../../../../types/data/Identity");
// tslint:disable:no-use-before-declare
/**
 * Checks and converts raw Bcoin {@link BCTX transactions} into valid {@link Contract}s
 *
 * @param {Identity<Role>[]} identities
 * @param {BCTX[]} rawBcoinTxs
 */
exports.getRoleContracts = function (identities, rawBcoinTxs) {
    return rawBcoinTxs.filter(exports.isContractTX()).reduce(function (contracts, tx) {
        var identity = identities.find(function (id) { return id.address === (id.role === Identity_1.Role.Provider ? exports.getProviderAddress(tx) : exports.getUserAddress(tx)); });
        if (identity) {
            var providerCtr = exports.convertToRoleContract(__assign({}, identity, { ext: identity.role === Identity_1.Role.Provider ? '1' : '0' }), tx);
            contracts.push(providerCtr);
        }
        return contracts;
    }, []);
};
/**
 * Attempt to find a {@link ImprintingContract} representation in raw Bcoin {@link BCTX transactions}
 *
 * Converts it into valid {@link ImprintingContract}
 *
 * @param {IdAddress} imprintingAddress
 * @param {BCTX[]} rawBcoinTxs
 * @returns {(ImprintingContract | void)} an {@link ImprintingContract} or undefined if not present
 */
exports.convertToImprintingContract = function (imprintingAddress, rawBcoinTxs) {
    var imprTx = rawBcoinTxs.find(exports.isImprintingTX(imprintingAddress));
    return imprTx
        ? {
            imprinting: true,
            identity: {
                role: Identity_1.Role.Provider,
                address: imprintingAddress,
                index: 0,
                ext: '0'
            },
            revoker: imprintingAddress,
            revoked: null,
            received: new Date().valueOf(),
            contractor: exports.getProviderAddress(imprTx),
            payload: []
        }
        : void 0;
};
/**
 * Attempt to find a {@link OrchestrationContract} representation in raw Bcoin {@link BCTX transactions}
 *
 * Converts it into valid {@link OrchestrationContract}
 *
 * @param {ImprintingContract} imprintingContract
 * @param {IdAddress} imprintingAddress
 * @param {BCTX[]} rawBcoinTxs
 * @returns {(OrchestrationContract | void)} an {@link OrchestrationContract} or undefined if not present
 */
exports.convertToOrchestrationContract = function (imprintingContract, orchestrationAddress, rawBcoinTxs) {
    var imprintingAddress = imprintingContract.revoker;
    var orchTx = rawBcoinTxs.filter(exports.isContractTX(true)).find(exports.isOrchestrationTX(orchestrationAddress, imprintingAddress));
    if (orchTx) {
        var revoker = exports.getRevokerAddress(orchTx);
        var orchestrationIdentity = {
            address: imprintingAddress,
            role: Identity_1.Role.Provider,
            index: 0,
            ext: '0'
        };
        var user = exports.getUserAddress(orchTx);
        var payload = exports.getPayload(orchTx);
        return {
            identity: orchestrationIdentity,
            orchestration: true,
            received: new Date().valueOf(),
            contractor: user,
            revoker: revoker,
            payload: payload,
            revoked: null
        };
    }
};
/**
 * converts a raw Bcoin {@link BCTX transaction} into a valid {@link Contract} for the given {@link BcoinIdentity<Role> identity}
 *
 *
 * @param {BcoinIdentity<Role>} identity
 * @param {BCTX} rawBcoinTx
 * @returns {Contract}
 */
exports.convertToRoleContract = function (identity, rawBcoinTx) {
    var revoker = exports.getRevokerAddress(rawBcoinTx);
    var isProviderIdentity = identity.role === Identity_1.Role.Provider;
    var contractor = isProviderIdentity ? exports.getUserAddress(rawBcoinTx) : exports.getProviderAddress(rawBcoinTx);
    var payload = exports.getPayload(rawBcoinTx);
    var contract = {
        identity: identity,
        received: new Date().valueOf(),
        contractor: contractor,
        revoker: revoker,
        payload: payload,
        revoked: null
    };
    if (identity.role === Identity_1.Role.Provider) {
        return contract;
    }
    else {
        return __assign({}, contract, { providerName: null });
    }
};
/**
 * filter the {@link IdAddress[] revoking addresses} against {@link BCTX[] raw Bcoin transactions} provided
 *
 * A revoking address present in any input of the provided transactions is considered as a revoking act
 *
 * @param {IdAddress[]} revokingAddresses
 * @param {BCTX[]} rawBcoinTxs
 * @returns {IdAddress[]} revoker's {@link IdAddress[] addresses} found in inputs are returned
 */
exports.getRevokingAddresses = function (revokingAddresses, rawBcoinTxs) {
    var txInputAddresses = rawBcoinTxs
        .map(function (tx) { return tx.inputs.map(base58); })
        .reduce(function (addresses, inputAddr) { return addresses.concat(inputAddr); }, []);
    var presentRevokingAddresses = revokingAddresses.filter(function (revokingAddress) {
        return txInputAddresses.includes(revokingAddress);
    });
    return presentRevokingAddresses;
};
exports.isContractTX = function (orchestration) {
    if (orchestration === void 0) { orchestration = false; }
    return function (tx // tslint:disable-next-line:no-magic-numbers
    ) {
        // tslint:disable-next-line:no-magic-numbers
        return (tx.inputs.length === 1 || tx.inputs.length === 2) &&
            // tslint:disable-next-line:no-magic-numbers
            (orchestration || tx.outputs.length === 4) &&
            tx.outputs[1].script &&
            tx.outputs[1].script.code &&
            tx.outputs[1].script.code[1] &&
            tx.outputs[1].script.code[1].data &&
            // tslint:disable-next-line:no-magic-numbers
            tx.outputs[1].script.code[1].data.length === 80;
    };
};
exports.isImprintingTX = function (imprintingAddress) { return function (rawBcoinTx) {
    return !!rawBcoinTx.outputs.find(function (output) { return base58(output) === imprintingAddress; });
}; };
exports.isOrchestrationTX = function (orchestrationAddress, imprintingAddress) { return function (rawBcoinTx) { return exports.getProviderAddress(rawBcoinTx) === imprintingAddress && exports.getChangeAddress(rawBcoinTx) === orchestrationAddress; }; };
exports.getProviderAddress = function (rawBcoinTx) { return base58(rawBcoinTx.inputs[0]); };
// const getRechargeAddress = (tx: any): IdAddress | null => (tx.inputs.length > 1 ? base58(tx.inputs[1]) : null)
exports.getUserAddress = function (rawBcoinTx) { return base58(rawBcoinTx.outputs[0]); };
exports.getPayload = function (rawBcoinTx) { return Array.from(rawBcoinTx.outputs[1].script.code[1].data); }; // .toString()
// tslint:disable-next-line:no-magic-numbers
exports.getRevokerAddress = function (rawBcoinTx) { return base58(rawBcoinTx.outputs[2]); };
// tslint:disable-next-line:no-magic-numbers
exports.getChangeAddress = function (rawBcoinTx) { return base58(rawBcoinTx.outputs[3]); };
var base58 = function (addr) { return addr.getAddress().toBase58(); };
//# sourceMappingURL=txContracts.js.map