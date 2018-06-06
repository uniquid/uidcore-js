"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const buffer_1 = require("buffer");
const Identity_1 = require("../../../types/data/Identity");
// tslint:disable-next-line:no-require-imports
const crypto = require('bcoin/lib/crypto');
// tslint:disable-next-line:no-require-imports
const secp256k1 = require('elliptic').ec('secp256k1');
// tslint:disable-next-line:no-require-imports
const base58 = require('bcoin/lib/utils/base58');
// tslint:disable-next-line:no-require-imports
const BcoinPrivateKey = require('bcoin/lib/hd/private');
const BASE_PATH = ['m', `44'`, `0'`, '0'];
const imprintingHDPath = ['0', '0', '0'];
const orchestrationHDPath = ['0', '1', '0'];
// export type DerivePrivateKey = (subPath: HDPath) => BcoinHDPrivateKey
const derivePrivateKey = (bip32ExtMasterPrivateKey) => (subPath) => {
    const masterPrivateKey = BcoinPrivateKey.fromBase58(bip32ExtMasterPrivateKey);
    const derivedPrivkey = masterPrivateKey.derivePath([...BASE_PATH, ...subPath].join('/'));
    return derivedPrivkey;
};
exports.signFor = (bip32ExtMasterPrivateKey) => (abstrId, hash, der = false) => {
    const isForProvider = abstrId.role === Identity_1.Role.Provider;
    const rolePath = isForProvider ? '0' : '1';
    const extOrInt = abstrId.ext || (isForProvider ? '1' : '0');
    const subPath = [rolePath, extOrInt, `${abstrId.index}`];
    const privK = derivePrivateKey(bip32ExtMasterPrivateKey)(subPath);
    const res = secp256k1.sign(hash, privK.privateKey, { canonical: true });
    // tslint:disable-next-line:no-magic-numbers
    return der ? res.toDER() : buffer_1.Buffer.concat([res.r.toBuffer(), res.s.toBuffer()], 64);
};
const base58AddrByPrivKey = (privkey) => {
    /**
     * http://bcoin.io/guides/generate-address.html
     */
    const step1 = crypto.sha256(privkey.toPublic().publicKey);
    const step2 = crypto.ripemd160(step1);
    const b = buffer_1.Buffer.alloc(1);
    // tslint:disable-next-line:no-magic-numbers
    b.writeUInt8(0x6f, 0); // (111) https://en.bitcoin.it/wiki/List_of_address_prefixes
    const step3 = buffer_1.Buffer.concat([b, step2]);
    const step4 = crypto.sha256(step3);
    const step5 = crypto.sha256(step4);
    // tslint:disable-next-line:no-magic-numbers
    const step6 = step5.slice(0, 4);
    const step7 = buffer_1.Buffer.concat([step3, step6]);
    const address = base58.encode(step7);
    return address;
};
exports.getImprintingAddress = (bip32ExtMasterPrivateKey) => () => {
    const imprintingHDKey = derivePrivateKey(bip32ExtMasterPrivateKey)(imprintingHDPath);
    return base58AddrByPrivKey(imprintingHDKey);
};
exports.getOrchestrateAddress = (bip32ExtMasterPrivateKey) => () => {
    const orchestrationHDKey = derivePrivateKey(bip32ExtMasterPrivateKey)(orchestrationHDPath);
    return base58AddrByPrivKey(orchestrationHDKey);
};
exports.getBaseXpub = (bip32ExtMasterPrivateKey) => () => derivePrivateKey(bip32ExtMasterPrivateKey)([]).toPublic().toBase58();
exports.publicKeyAtPath = (bip32ExtMasterPrivateKey) => (path) => derivePrivateKey(bip32ExtMasterPrivateKey)(path).toPublic().publicKey;
exports.identityFor = (bip32ExtMasterPrivateKey) => (abstrId) => {
    const { role, index } = abstrId;
    const isForProvider = role === Identity_1.Role.Provider;
    const rolePath = isForProvider ? '0' : '1';
    const extOrInt = abstrId.ext || (isForProvider ? '1' : '0');
    const subPath = [rolePath, extOrInt, `${index}`];
    const derivedPrivkey = derivePrivateKey(bip32ExtMasterPrivateKey)(subPath);
    const address = base58AddrByPrivKey(derivedPrivkey);
    return Object.assign({}, abstrId, { address });
};
//# sourceMappingURL=HD.js.map