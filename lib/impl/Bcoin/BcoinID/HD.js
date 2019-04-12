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
/**!
 *
 * Copyright 2016-2018 Uniquid Inc. or its affiliates. All Rights Reserved.
 *
 * License is in the "LICENSE" file accompanying this file.
 * See the License for the specific language governing permissions and limitations under the License.
 *
 */
var buffer_1 = require("buffer");
var Identity_1 = require("../../../types/data/Identity");
// tslint:disable-next-line:no-require-imports
var varuint = require('varuint-bitcoin');
// tslint:disable-next-line:no-require-imports
var crypto = require('lcoin/lib/crypto');
// tslint:disable-next-line:no-require-imports
var secp256k1 = require('secp256k1');
// tslint:disable-next-line:no-require-imports
var secp256k1DER = require('elliptic').ec('secp256k1');
// tslint:disable-next-line:no-require-imports
var bs58check = require('bs58check');
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
    /**
     * extract as (private?) function
     * it is necessary in 3 functions here
     */
    var isForProvider = abstrId.role === Identity_1.Role.Provider;
    var rolePath = isForProvider ? '0' : '1';
    var extOrInt = abstrId.ext || (isForProvider ? '1' : '0');
    var subPath = [rolePath, extOrInt, "" + abstrId.index];
    /**
     * ***
     */
    var privK = derivePrivateKey(bip32ExtMasterPrivateKey)(subPath);
    var res = secp256k1DER.sign(hash, privK.privateKey, { canonical: true });
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
    var address = bs58check.encode(step3);
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
    /**
     * extract as (private?) function
     * it is necessary in 3 functions here
     */
    var isForProvider = role === Identity_1.Role.Provider;
    var rolePath = isForProvider ? '0' : '1';
    var extOrInt = abstrId.ext || (isForProvider ? '1' : '0');
    var subPath = [rolePath, extOrInt, "" + index];
    /**
     * ***
     */
    var derivedPrivkey = derivePrivateKey(bip32ExtMasterPrivateKey)(subPath);
    var address = base58AddrByPrivKey(derivedPrivkey);
    return __assign({}, abstrId, { address: address });
}; };
exports.signMessage = function (bip32ExtMasterPrivateKey) { return function (message, abstractIdentity) {
    var messagePrefix = buffer_1.Buffer.from('\u0018Bitcoin Signed Message:\n', 'utf8');
    var messageVISize = varuint.encodingLength(message.length);
    var buffer = buffer_1.Buffer.allocUnsafe(messagePrefix.length + messageVISize + message.length);
    messagePrefix.copy(buffer, 0);
    varuint.encode(message.length, buffer, messagePrefix.length);
    buffer.write(message, messagePrefix.length + messageVISize);
    var hs = crypto.hash256(buffer);
    var isForProvider = abstractIdentity.role === Identity_1.Role.Provider;
    var rolePath = isForProvider ? '0' : '1';
    var extOrInt = abstractIdentity.ext || (isForProvider ? '1' : '0');
    var subPath = [rolePath, extOrInt, "" + abstractIdentity.index];
    var derivedPK = derivePrivateKey(bip32ExtMasterPrivateKey)(subPath);
    var sigObj = secp256k1.sign(hs, derivedPK.privateKey);
    // tslint:disable-next-line:no-magic-numbers
    sigObj.recovery += 4;
    // tslint:disable-next-line:no-magic-numbers
    var signatureWithRecovery = buffer_1.Buffer.concat([buffer_1.Buffer.alloc(1, sigObj.recovery + 27), sigObj.signature]);
    return signatureWithRecovery;
}; };
exports.recoverAddress = function (bip32ExtMasterPrivateKey) { return function (message, signature) {
    var signatureWithRecovery = buffer_1.Buffer.from(signature, 'base64');
    // tslint:disable-next-line:no-magic-numbers
    if (signatureWithRecovery.length !== 65)
        throw new Error('Invalid signature length');
    // tslint:disable-next-line:no-magic-numbers
    var flagByte = signatureWithRecovery.readUInt8(0) - 27;
    // tslint:disable-next-line:no-magic-numbers
    if (flagByte > 7)
        throw new Error('Invalid signature parameter');
    var parsed = {
        // tslint:disable-next-line:no-magic-numbers no-bitwise
        compressed: !!(flagByte & 4),
        // tslint:disable-next-line:no-magic-numbers no-bitwise
        recovery: flagByte & 3,
        signature: signatureWithRecovery.slice(1)
    };
    var messagePrefix = buffer_1.Buffer.from('\u0018Bitcoin Signed Message:\n', 'utf8');
    var messageVISize = varuint.encodingLength(message.length);
    var buffer = buffer_1.Buffer.allocUnsafe(messagePrefix.length + messageVISize + message.length);
    messagePrefix.copy(buffer, 0);
    varuint.encode(message.length, buffer, messagePrefix.length);
    buffer.write(message, messagePrefix.length + messageVISize);
    var hs = crypto.hash256(buffer);
    var publicKey = secp256k1.recover(hs, parsed.signature, parsed.recovery, parsed.compressed);
    var sh = crypto.sha256(publicKey);
    var add = crypto.ripemd160(sh);
    var newbuffer = buffer_1.Buffer.allocUnsafe(add.length + 1);
    newbuffer.write('\u006f', 0);
    add.copy(newbuffer, 1);
    return bs58check.encode(newbuffer);
}; };
exports.verifyMessage = function (bip32ExtMasterPrivateKey) { return function (message, signature) {
    // tslint:disable-next-line:no-require-imports
    var bitcoinMessage = require('bitcoinjs-message');
    var sBuffer = buffer_1.Buffer.from(signature, 'base64');
    var rAddr = exports.recoverAddress(bip32ExtMasterPrivateKey)(message, signature);
    var verify = bitcoinMessage.verify(message, rAddr, sBuffer);
    if (verify)
        return rAddr;
    return null;
}; };
//# sourceMappingURL=HD.js.map