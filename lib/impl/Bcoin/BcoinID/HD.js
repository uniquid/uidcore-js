"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var buffer_1 = require("buffer");
var Identity_1 = require("../../../types/data/Identity");
// tslint:disable-next-line:no-require-imports
var crypto = require('lcoin/lib/crypto');
// tslint:disable-next-line:no-require-imports
var secp256k1 = require('elliptic').ec('secp256k1');
// tslint:disable-next-line:no-require-imports
var base58 = require('lcoin/lib/utils/base58');
// tslint:disable-next-line:no-require-imports
var BcoinPrivateKey = require('lcoin/lib/hd/private');
var BASE_PATH = ['m', "44'", "0'", '0'];
var imprintingHDPath = ['0', '0', '0'];
var orchestrationHDPath = ['0', '1', '0'];
// export type DerivePrivateKey = (subPath: HDPath) => BcoinHDPrivateKey
var derivePrivateKey = function (bip32ExtMasterPrivateKey) { return function (subPath) {
    var masterPrivateKey = BcoinPrivateKey.fromBase58(bip32ExtMasterPrivateKey);
    var derivedPrivkey = masterPrivateKey.derivePath(BASE_PATH.concat(subPath).join('/'));
    return derivedPrivkey;
}; };
exports.signFor = function (bip32ExtMasterPrivateKey) { return function (abstrId, hash, der) {
    if (der === void 0) { der = false; }
    var isForProvider = abstrId.role === Identity_1.Role.Provider;
    var rolePath = isForProvider ? '0' : '1';
    var extOrInt = abstrId.ext || (isForProvider ? '1' : '0');
    var subPath = [rolePath, extOrInt, "" + abstrId.index];
    var privK = derivePrivateKey(bip32ExtMasterPrivateKey)(subPath);
    var res = secp256k1.sign(hash, privK.privateKey, { canonical: true });
    // tslint:disable-next-line:no-magic-numbers
    return der ? res.toDER() : buffer_1.Buffer.concat([res.r.toBuffer(), res.s.toBuffer()], 64);
}; };
var base58AddrByPrivKey = function (privkey) {
    /**
     * http://bcoin.io/guides/generate-address.html
     */
    var step1 = crypto.sha256(privkey.toPublic().publicKey);
    var step2 = crypto.ripemd160(step1);
    var b = buffer_1.Buffer.alloc(1);
    // tslint:disable-next-line:no-magic-numbers
    b.writeUInt8(0x6f, 0); // (111) https://en.bitcoin.it/wiki/List_of_address_prefixes
    var step3 = buffer_1.Buffer.concat([b, step2]);
    var step4 = crypto.sha256(step3);
    var step5 = crypto.sha256(step4);
    // tslint:disable-next-line:no-magic-numbers
    var step6 = step5.slice(0, 4);
    var step7 = buffer_1.Buffer.concat([step3, step6]);
    var address = base58.encode(step7);
    return address;
};
exports.getImprintingAddress = function (bip32ExtMasterPrivateKey) { return function () {
    var imprintingHDKey = derivePrivateKey(bip32ExtMasterPrivateKey)(imprintingHDPath);
    return base58AddrByPrivKey(imprintingHDKey);
}; };
exports.getOrchestrateAddress = function (bip32ExtMasterPrivateKey) { return function () {
    var orchestrationHDKey = derivePrivateKey(bip32ExtMasterPrivateKey)(orchestrationHDPath);
    return base58AddrByPrivKey(orchestrationHDKey);
}; };
exports.getBaseXpub = function (bip32ExtMasterPrivateKey) { return function () {
    return derivePrivateKey(bip32ExtMasterPrivateKey)([]).toPublic().toBase58();
}; };
exports.publicKeyAtPath = function (bip32ExtMasterPrivateKey) { return function (path) {
    return derivePrivateKey(bip32ExtMasterPrivateKey)(path).toPublic().publicKey;
}; };
exports.identityFor = function (bip32ExtMasterPrivateKey) { return function (abstrId) {
    var role = abstrId.role, index = abstrId.index;
    var isForProvider = role === Identity_1.Role.Provider;
    var rolePath = isForProvider ? '0' : '1';
    var extOrInt = abstrId.ext || (isForProvider ? '1' : '0');
    var subPath = [rolePath, extOrInt, "" + index];
    var derivedPrivkey = derivePrivateKey(bip32ExtMasterPrivateKey)(subPath);
    var address = base58AddrByPrivKey(derivedPrivkey);
    return __assign({}, abstrId, { address: address });
}; };
//# sourceMappingURL=HD.js.map