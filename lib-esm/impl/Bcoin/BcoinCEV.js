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
const fs_1 = require("fs");
const path = require("path");
const CtrManager_1 = require("./BcoinCEV/CtrManager");
const Pool_1 = require("./BcoinCEV/Pool");
const sign_1 = require("./BcoinCEV/TX/sign");
/**
 * constructs a {@link BcoinCEV}
 * @param {BcoinDB} db a BcoinDB instance
 * @param {BcoinID} id a BcoinID instance
 * @param {Options} options Options
 * @returns {BcoinCEV}
 */
exports.makeBcoinCEV = (db, id, options) => {
    if (!fs_1.existsSync(options.home)) {
        fs_1.mkdirSync(options.home);
    }
    const poolPromise = Pool_1.Pool({
        dbFolder: path.join(options.home, 'chain.db'),
        logLevel: options.logLevel,
        seeds: options.seeds
    });
    poolPromise
        .then(pool => CtrManager_1.startContractManager(db, id, pool, options.watchahead, options.providerNameResolver))
        .catch(err => console.log('makeBcoinCEV ERROR', err));
    const signRawTransaction = (txString, paths) => {
        const { signedTxObj, txid } = sign_1.transactionSigner(id, txString, paths);
        return poolPromise.then(pool => pool.broadcast(txid, signedTxObj)).then(() => txid);
    };
    return {
        signRawTransaction
    };
};
//# sourceMappingURL=BcoinCEV.js.map