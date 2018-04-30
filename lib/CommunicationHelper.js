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
exports.communicationHelperFactory = function (cev, db, id) {
    var sign = id.signFor;
    // const verify
    var getPayload = db.getPayload;
    var getContractForExternalUser = db.getContractForExternalUser;
    var identityFor = id.identityFor;
    return {
        identityFor: identityFor,
        getContractForExternalUser: getContractForExternalUser,
        sign: sign,
        getPayload: getPayload
    };
};
//# sourceMappingURL=CommunicationHelper.js.map