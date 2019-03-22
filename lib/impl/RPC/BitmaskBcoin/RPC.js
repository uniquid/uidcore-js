"use strict";
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
var PayloadDef_1 = require("./PayloadDef");
var types_1 = require("./types");
var bitmask = function (payload) {
    return payload
        .slice(PayloadDef_1.VERSION_BYTE_LENGTH, PayloadDef_1.VERSION_BYTE_LENGTH + PayloadDef_1.SYSTEM_RESERVED_RPC_FUNCS_BYTE_LENGTH + PayloadDef_1.USER_DEFINED_RPC_FUNCS_BYTE_LENGTH)
        .reverse()
        .map(function (n) { return Array.from(n.toString(2).padStart(8, '0')); })
        .reduce(function (a, b) { return a.concat(b); })
        .reverse()
        .map(function (str) { return Boolean(Number(str)); });
};
var verify = function (payload, method) { return bitmask(payload)[method]; };
var manageRequest = function (db, id, handlers) { return function (request) {
    return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
        var _a, method, params, js, valid, _sender, contract, error, result, handler, err_1, response, jsresp, sjson, contract, error, result, providerIdentity, sender, handler, err_2, response;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = request.body, method = _a.method, params = _a.params;
                    if (!(!request.hasOwnProperty('sender') && request.hasOwnProperty('signature'))) return [3 /*break*/, 13];
                    js = request.body.method + request.body.params + request.body.id;
                    valid = id.verifyMessage(js, request.signature);
                    if (!valid) return [3 /*break*/, 11];
                    _sender = id.recoverAddress(js, request.signature);
                    contract = db.getContractForExternalUser(_sender);
                    if (!contract) return [3 /*break*/, 9];
                    error = types_1.ERROR_NONE;
                    result = types_1.BLANK_RESULT;
                    if (!(contract.imprinting || verify(contract.payload, method))) return [3 /*break*/, 7];
                    handler = handlers[method];
                    if (!handler) return [3 /*break*/, 5];
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, handler(params, contract)];
                case 2:
                    result = _b.sent();
                    return [3 /*break*/, 4];
                case 3:
                    err_1 = _b.sent();
                    result = String(err_1);
                    return [3 /*break*/, 4];
                case 4: return [3 /*break*/, 6];
                case 5:
                    error = types_1.ERROR_METHOD_NOT_IMPLEMENTED;
                    _b.label = 6;
                case 6: return [3 /*break*/, 8];
                case 7:
                    error = types_1.ERROR_NOT_AUTHORIZED;
                    _b.label = 8;
                case 8:
                    response = {
                        requester: _sender,
                        body: {
                            result: result,
                            error: error,
                            id: request.body.id
                        },
                        signature: ''
                    };
                    jsresp = response.body.error + response.body.result + response.body.id;
                    sjson = id.signMessage(jsresp, contract.identity);
                    response.signature = sjson.toString('base64');
                    resolve(response);
                    return [3 /*break*/, 10];
                case 9:
                    reject("No contract for user:" + _sender);
                    _b.label = 10;
                case 10: return [3 /*break*/, 12];
                case 11:
                    reject("Signature is not valid");
                    _b.label = 12;
                case 12: return [3 /*break*/, 23];
                case 13:
                    contract = db.getContractForExternalUser(request.sender);
                    if (!contract) return [3 /*break*/, 22];
                    error = types_1.ERROR_NONE;
                    result = types_1.BLANK_RESULT;
                    providerIdentity = id.identityFor(contract.identity);
                    sender = providerIdentity.address;
                    if (!(contract.imprinting || verify(contract.payload, method))) return [3 /*break*/, 20];
                    handler = handlers[method];
                    if (!handler) return [3 /*break*/, 18];
                    _b.label = 14;
                case 14:
                    _b.trys.push([14, 16, , 17]);
                    return [4 /*yield*/, handler(params, contract)];
                case 15:
                    result = _b.sent();
                    return [3 /*break*/, 17];
                case 16:
                    err_2 = _b.sent();
                    result = String(err_2);
                    return [3 /*break*/, 17];
                case 17: return [3 /*break*/, 19];
                case 18:
                    error = types_1.ERROR_METHOD_NOT_IMPLEMENTED;
                    _b.label = 19;
                case 19: return [3 /*break*/, 21];
                case 20:
                    error = types_1.ERROR_NOT_AUTHORIZED;
                    _b.label = 21;
                case 21:
                    response = {
                        sender: sender,
                        body: {
                            result: result,
                            error: error,
                            id: request.body.id
                        }
                    };
                    resolve(response);
                    _b.label = 22;
                case 22:
                    reject("No contract for user:" + request.sender);
                    _b.label = 23;
                case 23: return [2 /*return*/];
            }
        });
    }); });
}; };
var ECHO_FN = 31;
var echo = function (what) { return what; };
var SIGN_FN = 30;
var sign = function (cev) { return function (params) { return __awaiter(_this, void 0, void 0, function () {
    var _a, tx, paths, hdPaths;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = JSON.parse(params), tx = _a.tx, paths = _a.paths;
                hdPaths = paths.map(function (str) { return str.split('/'); });
                return [4 /*yield*/, cev.signRawTransaction(tx, hdPaths).then(function (txid) { return "0 - " + txid; })];
            case 1: return [2 /*return*/, _b.sent()];
        }
    });
}); }; };
var MIN_USER_FUNC_BIT = 32;
var MAX_USER_FUNC_BIT = 143;
exports.makeRPC = function (cev, db, id) {
    var handlers = {};
    var register = function (method, handler) { return (handlers[method] = handler); };
    register(SIGN_FN, sign(cev));
    register(ECHO_FN, echo);
    var registerUserFunctionHandler = function (method, handler) {
        return method >= MIN_USER_FUNC_BIT && method <= MAX_USER_FUNC_BIT ? (handlers[method] = handler) : null;
    };
    return {
        manageRequest: manageRequest(db, id, handlers),
        register: registerUserFunctionHandler
    };
};
//# sourceMappingURL=RPC.js.map