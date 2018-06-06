"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const PayloadDef_1 = require("./PayloadDef");
const types_1 = require("./types");
const bitmask = (payload) => payload
    .slice(PayloadDef_1.VERSION_BYTE_LENGTH, PayloadDef_1.VERSION_BYTE_LENGTH + PayloadDef_1.SYSTEM_RESERVED_RPC_FUNCS_BYTE_LENGTH + PayloadDef_1.USER_DEFINED_RPC_FUNCS_BYTE_LENGTH)
    .reverse()
    // convert to binary string an pad left 0s up to 8 (bytelength)
    // tslint:disable-next-line:no-magic-numbers
    .map(n => Array.from(n.toString(2).padStart(8, '0')))
    .reduce((a, b) => a.concat(b))
    .reverse()
    .map(str => Boolean(Number(str)));
const verify = (payload, method) => bitmask(payload)[method];
const manageRequest = (db, id, handlers) => (request) => new Promise(async (resolve, reject) => {
    const { method, params } = request.body;
    const contract = db.getContractForExternalUser(request.sender);
    if (contract) {
        let error = types_1.ERROR_NONE;
        let result = types_1.BLANK_RESULT;
        const providerIdentity = id.identityFor(contract.identity);
        const sender = providerIdentity.address;
        if (contract.imprinting || verify(contract.payload, method)) {
            const handler = handlers[method];
            if (handler) {
                try {
                    result = await handler(params);
                }
                catch (err) {
                    result = String(err);
                }
            }
            else {
                error = types_1.ERROR_METHOD_NOT_IMPLEMENTED;
            }
        }
        else {
            error = types_1.ERROR_NOT_AUTHORIZED;
        }
        const response = {
            sender,
            body: {
                result,
                error,
                id: request.body.id
            }
        };
        resolve(response);
    }
    reject(`No contract for user:${request.sender}`);
});
const ECHO_FN = 31;
const echo = (what) => what;
const SIGN_FN = 30;
const sign = (cev) => async (params) => {
    const { tx, paths } = JSON.parse(params);
    const hdPaths = paths.map(str => str.split('/'));
    return await cev.signRawTransaction(tx, hdPaths).then(txid => `0 - ${txid}`);
};
const MIN_USER_FUNC_BIT = 32;
const MAX_USER_FUNC_BIT = 143;
exports.makeRPC = (cev, db, id) => {
    const handlers = {};
    const register = (method, handler) => (handlers[method] = handler);
    register(SIGN_FN, sign(cev));
    register(ECHO_FN, echo);
    const registerUserFunctionHandler = (method, handler) => method >= MIN_USER_FUNC_BIT && method <= MAX_USER_FUNC_BIT ? (handlers[method] = handler) : null;
    return {
        manageRequest: manageRequest(db, id, handlers),
        register: registerUserFunctionHandler
    };
};
//# sourceMappingURL=RPC.js.map