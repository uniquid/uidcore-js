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
var Identity_1 = require("../../../../types/data/Identity");
var hex_1 = require("./../../utils/hex");
var parse_1 = require("./parse");
// tslint:disable-next-line:no-require-imports
var sha265 = require('bcoin/lib/crypto/sha256');
// tslint:disable-next-line:no-require-imports
var crypto = require('bcoin/lib/crypto');
var inputSignerFor = function (id, txObj) { return function (path, pathIndex) {
    var originalInput = txObj.inputs[pathIndex];
    var publicKey = id.publicKeyAtPath(path);
    var localInputs = txObj.inputs.map(function (currScriptInput, currScriptInputIndex) {
        if (currScriptInputIndex === pathIndex) {
            var pubkeySha256 = crypto.sha256(publicKey);
            var pubkeyHashRipmed160 = crypto.ripemd160(pubkeySha256);
            var pubkeyHashRipmed160Array = Array.from(pubkeyHashRipmed160);
            // prettier-ignore
            // tslint:disable-next-line:no-magic-numbers
            var script_1 = [0x76, 0xa9, 0x14].concat(pubkeyHashRipmed160Array, [0x88, 0xac]);
            return __assign({}, originalInput, { script: script_1 });
        }
        else {
            return __assign({}, currScriptInput, { script: [] });
        }
    });
    var localTxObj = __assign({}, txObj, { inputs: localInputs });
    // append hash code type
    var localTxForSign = parse_1.formatTx(localTxObj).concat([0x01, 0x00, 0x00, 0x00]);
    var hash = sha265.hash256(localTxForSign);
    var role = Number(path[0]) === 0 ? Identity_1.Role.Provider : Identity_1.Role.User;
    var ext = path[1];
    // tslint:disable-next-line:no-magic-numbers
    var index = Number(path[2]);
    var absId = {
        role: role,
        ext: ext,
        index: index
    };
    var DERsignature = Buffer.from(id.signFor(absId, hash, true));
    var DERWithHashCode = Buffer.concat([DERsignature, Buffer.from([0x01])]);
    // tslint:disable-next-line:no-magic-numbers
    var OP_PUSH_DER = DERWithHashCode.length === 71 ? 0x47 : 0x48;
    // tslint:disable-next-line:no-magic-numbers
    var OP_PUSH_PK = 0x21;
    // prettier-ignore
    var script = Array.from(Buffer.concat([
        Buffer.from([OP_PUSH_DER]),
        DERWithHashCode,
        Buffer.from([OP_PUSH_PK]),
        publicKey
    ]));
    return __assign({}, originalInput, { script: script });
}; };
/**
 * Signs a bitcoin transaction inputs against BIP32 iden(tities at the {@link HDPath paths} specified
 * paths must be relative to UQBasePath ( m/44'/0'0 )
 *
 * @param {BcoinID} id an instance of {@link BcoinID} for actual byte[] signing
 * @param {string} rawtx  a UQ-transaction-compliant-contract as input
 * @param {HDPath[]} paths BIP32 paths forinput signing
 * @returns {SignResult}
 */
exports.transactionSigner = function (id, rawtx, paths) {
    var txObj = parse_1.parseTx(rawtx);
    if (txObj.inputs.length !== paths.length) {
        throw TypeError('Inputs and paths lengths should be equal');
    }
    var inputSigner = inputSignerFor(id, txObj);
    var inputs = paths.map(inputSigner);
    var signedTxObj = __assign({}, txObj, { inputs: inputs });
    var txid = sha265.hash256(parse_1.formatTx(signedTxObj));
    var txidReverse = Array.from(txid).reverse();
    return { txid: hex_1.intArrayToRawHexString(txidReverse), signedTxObj: signedTxObj };
};
//# sourceMappingURL=sign.js.map