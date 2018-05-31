"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = require("fs");
var fs = require("fs");
var path = require("path");
var hd = require("./BcoinID/HD");
// tslint:disable-next-line:no-require-imports
var BcoinPrivateKey = require('bcoin/lib/hd/private');
var PK_FILE_NAME = 'private.key';
/**
 * constructs a {@link BcoinID}
 * @param {Options} options Options
 * @returns {Promise<BcoinID>}
 */
exports.makeBcoinID = function (options) {
    return new Promise(function (resolve, reject) {
        if (!fs_1.existsSync(options.home)) {
            fs_1.mkdir(options.home);
        }
        var privateKeyBase58;
        var privateKeyFilePath = path.join(options.home, PK_FILE_NAME);
        var exists = fs.existsSync(privateKeyFilePath);
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
};
//# sourceMappingURL=BcoinID.js.map