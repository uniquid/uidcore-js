"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Builds a CommunicationHelper encapsulating components provided
 *
 * @param {ContractExchangeValidator} cev
 * @param {DB} db
 * @param {ID} id
 * @returns {CommunicationHelper}
 */
exports.communicationHelperFactory = (cev, db, id) => {
    const sign = id.signFor;
    // const verify
    const getPayload = db.getPayload;
    const getContractForExternalUser = db.getContractForExternalUser;
    const identityFor = id.identityFor;
    return {
        identityFor,
        getContractForExternalUser,
        sign,
        getPayload
    };
};
//# sourceMappingURL=CommunicationHelper.js.map