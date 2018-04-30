"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Identity_1 = require("./../../../../types/data/Identity");
// tslint:disable:no-use-before-declare
/**
 * Checks and converts raw Bcoin {@link BCTX transactions} into valid {@link Contract}s
 *
 * @param {Identity<Role>[]} identities
 * @param {BCTX[]} rawBcoinTxs
 */
exports.getRoleContracts = (identities, rawBcoinTxs) => rawBcoinTxs.filter(exports.isContractTX()).reduce((contracts, tx) => {
    const identity = identities.find(id => id.address === exports.getProviderAddress(tx) || id.address === exports.getUserAddress(tx));
    if (identity) {
        const providerCtr = exports.convertToRoleContract(Object.assign({}, identity, { ext: identity.role === Identity_1.Role.Provider ? '1' : '0' }), tx);
        contracts.push(providerCtr);
    }
    return contracts;
}, []);
/**
 * Attempt to find a {@link ImprintingContract} representation in raw Bcoin {@link BCTX transactions}
 *
 * Converts it into valid {@link ImprintingContract}
 *
 * @param {IdAddress} imprintingAddress
 * @param {BCTX[]} rawBcoinTxs
 * @returns {(ImprintingContract | void)} an {@link ImprintingContract} or undefined if not present
 */
exports.convertToImprintingContract = (imprintingAddress, rawBcoinTxs) => {
    const imprTx = rawBcoinTxs.find(exports.isImprintingTX(imprintingAddress));
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
exports.convertToOrchestrationContract = (imprintingContract, orchestrationAddress, rawBcoinTxs) => {
    const imprintingAddress = imprintingContract.revoker;
    const orchTx = rawBcoinTxs.filter(exports.isContractTX(true)).find(exports.isOrchestrationTX(orchestrationAddress, imprintingAddress));
    if (orchTx) {
        const revoker = exports.getRevokerAddress(orchTx);
        const orchestrationIdentity = {
            address: imprintingAddress,
            role: Identity_1.Role.Provider,
            index: 0,
            ext: '0'
        };
        const user = exports.getUserAddress(orchTx);
        const payload = exports.getPayload(orchTx);
        return {
            identity: orchestrationIdentity,
            orchestration: true,
            received: new Date().valueOf(),
            contractor: user,
            revoker,
            payload,
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
exports.convertToRoleContract = (identity, rawBcoinTx) => {
    const revoker = exports.getRevokerAddress(rawBcoinTx);
    const isProviderIdentity = identity.role === Identity_1.Role.Provider;
    const contractor = isProviderIdentity ? exports.getUserAddress(rawBcoinTx) : exports.getProviderAddress(rawBcoinTx);
    const payload = exports.getPayload(rawBcoinTx);
    const contract = {
        identity,
        received: new Date().valueOf(),
        contractor,
        revoker,
        payload,
        revoked: null
    };
    if (identity.role === Identity_1.Role.Provider) {
        return contract;
    }
    else {
        return Object.assign({}, contract, { providerName: null });
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
exports.getRevokingAddresses = (revokingAddresses, rawBcoinTxs) => {
    const txInputAddresses = rawBcoinTxs
        .map(tx => tx.inputs.map(base58))
        .reduce((addresses, inputAddr) => addresses.concat(inputAddr), []);
    return revokingAddresses.filter(revokingAddress => txInputAddresses.includes(revokingAddress));
};
exports.isContractTX = (orchestration = false) => (tx // tslint:disable-next-line:no-magic-numbers
) => 
// tslint:disable-next-line:no-magic-numbers
(tx.inputs.length === 1 || tx.inputs.length === 2) &&
    // tslint:disable-next-line:no-magic-numbers
    (orchestration || tx.outputs.length === 4) &&
    tx.outputs[1].script &&
    tx.outputs[1].script.code &&
    tx.outputs[1].script.code[1] &&
    tx.outputs[1].script.code[1].data &&
    // tslint:disable-next-line:no-magic-numbers
    tx.outputs[1].script.code[1].data.length === 80;
exports.isImprintingTX = (imprintingAddress) => (rawBcoinTx) => !!rawBcoinTx.outputs.find((output) => base58(output) === imprintingAddress);
exports.isOrchestrationTX = (orchestrationAddress, imprintingAddress) => (rawBcoinTx) => exports.getProviderAddress(rawBcoinTx) === imprintingAddress && exports.getChangeAddress(rawBcoinTx) === orchestrationAddress;
exports.getProviderAddress = (rawBcoinTx) => base58(rawBcoinTx.inputs[0]);
// const getRechargeAddress = (tx: any): IdAddress | null => (tx.inputs.length > 1 ? base58(tx.inputs[1]) : null)
exports.getUserAddress = (rawBcoinTx) => base58(rawBcoinTx.outputs[0]);
exports.getPayload = (rawBcoinTx) => Array.from(rawBcoinTx.outputs[1].script.code[1].data); // .toString()
// tslint:disable-next-line:no-magic-numbers
exports.getRevokerAddress = (rawBcoinTx) => base58(rawBcoinTx.outputs[2]);
// tslint:disable-next-line:no-magic-numbers
exports.getChangeAddress = (rawBcoinTx) => base58(rawBcoinTx.outputs[3]);
const base58 = (addr) => addr.getAddress().toBase58();
//# sourceMappingURL=txContracts.js.map