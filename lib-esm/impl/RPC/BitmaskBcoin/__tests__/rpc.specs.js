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
const path = require("path");
const sign_1 = require("../../../Bcoin/BcoinCEV/TX/sign");
const RPC_1 = require("../RPC");
const BcoinDB_1 = require("./../../../Bcoin/BcoinDB");
const BcoinID_1 = require("./../../../Bcoin/BcoinID");
const tests_1 = require("./tests");
describe('RPC', () => {
    tests_1.default.forEach(test => it(`
        scenario: ${test.scenario}
        description: ${test.description}
        method: ${test.request.body.method}
        sender: ${test.request.sender}`, () => {
        const scenarioDir = path.join(__dirname, 'scenarios', test.scenario);
        const idOpts = {
            home: path.join(scenarioDir, 'id_home'),
            network: 'uqregtest'
        };
        const dbOpts = { home: path.join(scenarioDir, 'db_home') };
        return Promise.all([BcoinID_1.makeBcoinID(idOpts), BcoinDB_1.makeBcoinDB(dbOpts)])
            .then(([id, db]) => {
            const mockCEV = {
                signRawTransaction: (txString, paths) => Promise.resolve(sign_1.transactionSigner(id, txString, paths).txid)
            };
            const rpc = RPC_1.makeRPC(mockCEV, db, id);
            return rpc.manageRequest(test.request);
        })
            .then(resp => {
            expect(resp).toEqual(test.response);
        })
            .catch(() => {
            expect(null).toEqual(test.response);
        });
    }));
});
//# sourceMappingURL=rpc.specs.js.map