"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**!
 *
 * Copyright 2016-2018 Uniquid Inc. or its affiliates. All Rights Reserved.
 *
 * License is in the "LICENSE" file accompanying this file.
 * See the License for the specific language governing permissions and limitations under the License.
 *
 */
const Identity_1 = require("../../../../types/data/Identity");
const hex_1 = require("./../../utils/hex");
const parse_1 = require("./parse");
// tslint:disable-next-line:no-require-imports
const sha265 = require('lcoin/lib/crypto/sha256');
// tslint:disable-next-line:no-require-imports
const crypto = require('lcoin/lib/crypto');
const inputSignerFor = (id, txObj) => (path, pathIndex) => {
    const originalInput = txObj.inputs[pathIndex];
    const publicKey = id.publicKeyAtPath(path);
    const localInputs = txObj.inputs.map((currScriptInput, currScriptInputIndex) => {
        if (currScriptInputIndex === pathIndex) {
            const pubkeySha256 = crypto.sha256(publicKey);
            const pubkeyHashRipmed160 = crypto.ripemd160(pubkeySha256);
            const pubkeyHashRipmed160Array = Array.from(pubkeyHashRipmed160);
            // prettier-ignore
            // tslint:disable-next-line:no-magic-numbers
            const script = [0x76, 0xa9, 0x14, ...pubkeyHashRipmed160Array, 0x88, 0xac];
            return Object.assign({}, originalInput, { script });
        }
        else {
            return Object.assign({}, currScriptInput, { script: [] });
        }
    });
    const localTxObj = Object.assign({}, txObj, { inputs: localInputs });
    // append hash code type
    const localTxForSign = parse_1.formatTx(localTxObj).concat([0x01, 0x00, 0x00, 0x00]);
    const hash = sha265.hash256(localTxForSign);
    const role = Number(path[0]) === 0 ? Identity_1.Role.Provider : Identity_1.Role.User;
    const ext = path[1];
    // tslint:disable-next-line:no-magic-numbers
    const index = Number(path[2]);
    const absId = {
        role,
        ext,
        index
    };
    const DERsignature = Buffer.from(id.signFor(absId, hash, true));
    const DERWithHashCode = Buffer.concat([DERsignature, Buffer.from([0x01])]);
    // tslint:disable-next-line:no-magic-numbers
    const OP_PUSH_DER = DERWithHashCode.length === 71 ? 0x47 : 0x48;
    // tslint:disable-next-line:no-magic-numbers
    const OP_PUSH_PK = 0x21;
    // prettier-ignore
    const script = Array.from(Buffer.concat([
        Buffer.from([OP_PUSH_DER]),
        DERWithHashCode,
        Buffer.from([OP_PUSH_PK]),
        publicKey
    ]));
    return Object.assign({}, originalInput, { script });
};
/**
 * Signs a bitcoin transaction inputs against BIP32 iden(tities at the {@link HDPath paths} specified
 * paths must be relative to UQBasePath ( m/44'/0'0 )
 *
 * @param {BcoinID} id an instance of {@link BcoinID} for actual byte[] signing
 * @param {string} rawtx  a UQ-transaction-compliant-contract as input
 * @param {HDPath[]} paths BIP32 paths forinput signing
 * @returns {SignResult}
 */
exports.transactionSigner = (id, rawtx, paths) => {
    const txObj = parse_1.parseTx(rawtx);
    if (txObj.inputs.length !== paths.length) {
        throw TypeError('Inputs and paths lengths should be equal');
    }
    const inputSigner = inputSignerFor(id, txObj);
    const inputs = paths.map(inputSigner);
    const signedTxObj = Object.assign({}, txObj, { inputs });
    const txid = sha265.hash256(parse_1.formatTx(signedTxObj));
    const txidReverse = Array.from(txid).reverse();
    return { txid: hex_1.intArrayToRawHexString(txidReverse), signedTxObj };
};
//# sourceMappingURL=sign.js.map