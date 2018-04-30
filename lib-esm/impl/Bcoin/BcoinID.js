"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
const hd = require("./BcoinID/HD");
// tslint:disable-next-line:no-require-imports
const BcoinPrivateKey = require('bcoin/lib/hd/private');
const PK_FILE_NAME = 'private.key';
/**
 * constructs a {@link BcoinID}
 * @param {Options} options Options
 * @returns {Promise<BcoinID>}
 */
exports.makeBcoinID = (options) => new Promise((resolve, reject) => {
    let privateKeyBase58;
    const privateKeyFilePath = path.join(options.home, PK_FILE_NAME);
    const exists = fs.existsSync(privateKeyFilePath);
    if (exists) {
        privateKeyBase58 = fs.readFileSync(privateKeyFilePath, 'UTF8');
    }
    else {
        privateKeyBase58 = BcoinPrivateKey.generate().toBase58();
        fs.writeFileSync(privateKeyFilePath, privateKeyBase58, { encoding: 'UTF8' });
    }
    resolve({
        signFor: hd.signFor(privateKeyBase58),
        identityFor: hd.identityFor(privateKeyBase58),
        getImprintingAddress: hd.getImprintingAddress(privateKeyBase58),
        getOrchestrateAddress: hd.getOrchestrateAddress(privateKeyBase58),
        publicKeyAtPath: hd.publicKeyAtPath(privateKeyBase58),
        getBaseXpub: hd.getBaseXpub(privateKeyBase58)
    });
});
//# sourceMappingURL=BcoinID.js.map