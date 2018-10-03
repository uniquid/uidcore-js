"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path = require("path");
const hd = require("./BcoinID/HD");
// tslint:disable-next-line:no-require-imports
const BcoinPrivateKey = require('lcoin/lib/hd/private');
// tslint:disable-next-line:no-require-imports
const bcoin = require('lcoin');
bcoin.networks.uqregtest = Object.assign({}, bcoin.networks.regtest, {
    port: 19000,
    addressPrefix: bcoin.networks.testnet.addressPrefix,
    keyPrefix: Object.assign({}, bcoin.networks.testnet.keyPrefix, {
        coinType: 0
    }),
    seeds: ['40.115.9.216', '40.115.10.153', '40.115.103.9']
});
const PK_FILE_NAME = 'private.key';
/**
 * constructs a {@link BcoinID}
 * @param {Options} options Options
 * @returns {Promise<BcoinID>}
 */
exports.makeBcoinID = (options) => {
    bcoin.set(options.network);
    return new Promise((resolve, reject) => {
        if (!fs_1.existsSync(options.home)) {
            fs_1.mkdirSync(options.home);
        }
        let privateKeyBase58;
        const privateKeyFilePath = path.join(options.home, PK_FILE_NAME);
        const exists = fs_1.existsSync(privateKeyFilePath);
        if (exists) {
            privateKeyBase58 = fs_1.readFileSync(privateKeyFilePath, 'UTF8');
        }
        else {
            privateKeyBase58 = BcoinPrivateKey.generate().toBase58();
            fs_1.writeFileSync(privateKeyFilePath, privateKeyBase58, { encoding: 'UTF8' });
        }
        resolve({
            signFor: hd.signFor(privateKeyBase58),
            identityFor: hd.identityFor(privateKeyBase58),
            getImprintingAddress: hd.getImprintingAddress(privateKeyBase58),
            getOrchestrateAddress: hd.getOrchestrateAddress(privateKeyBase58),
            publicKeyAtPath: hd.publicKeyAtPath(privateKeyBase58),
            getBaseXpub: hd.getBaseXpub(privateKeyBase58),
            signMessage: hd.signMessage(privateKeyBase58)
        });
    });
};
//# sourceMappingURL=BcoinID.js.map