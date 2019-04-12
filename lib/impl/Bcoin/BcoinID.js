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
var fs_1 = require("fs");
var path = require("path");
var hd = require("./BcoinID/HD");
// tslint:disable-next-line:no-require-imports
var BcoinPrivateKey = require('lcoin/lib/hd/private');
// tslint:disable-next-line:no-require-imports
var bcoin = require('lcoin');
bcoin.networks.uqregtest = Object.assign({}, bcoin.networks.regtest, {
    port: 19000,
    addressPrefix: bcoin.networks.testnet.addressPrefix,
    keyPrefix: Object.assign({}, bcoin.networks.testnet.keyPrefix, {
        coinType: 0
    }),
    seeds: ['40.115.9.216', '40.115.10.153', '40.115.103.9']
});
var PK_FILE_NAME = 'private.key';
/**
 * constructs a {@link BcoinID}
 * @param {Options} options Options
 * @returns {Promise<BcoinID>}
 */
exports.makeBcoinID = function (options) {
    bcoin.set(options.network);
    return new Promise(function (resolve, reject) {
        if (!fs_1.existsSync(options.home)) {
            fs_1.mkdirSync(options.home);
        }
        var privateKeyBase58;
        var privateKeyFilePath = path.join(options.home, PK_FILE_NAME);
        var exists = fs_1.existsSync(privateKeyFilePath);
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
            signMessage: hd.signMessage(privateKeyBase58),
            verifyMessage: hd.verifyMessage(privateKeyBase58),
            recoverAddress: hd.recoverAddress(privateKeyBase58)
        });
    });
};
//# sourceMappingURL=BcoinID.js.map