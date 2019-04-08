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
var path = require("path");
var sign_1 = require("../../../Bcoin/BcoinCEV/TX/sign");
var RPC_1 = require("../RPC");
var BcoinDB_1 = require("./../../../Bcoin/BcoinDB");
var BcoinID_1 = require("./../../../Bcoin/BcoinID");
var tests_1 = require("./tests");
describe('RPC', function () {
    tests_1.default.forEach(function (test) {
        return it("\n        scenario: " + test.scenario + "\n        description: " + test.description + "\n        method: " + test.request.body.method, function () {
            // sender: ${test.request.sender}`,() => {
            var scenarioDir = path.join(__dirname, 'scenarios', test.scenario);
            var idOpts = {
                home: path.join(scenarioDir, 'id_home'),
                network: 'uqregtest'
            };
            var dbOpts = { home: path.join(scenarioDir, 'db_home') };
            return Promise.all([BcoinID_1.makeBcoinID(idOpts), BcoinDB_1.makeBcoinDB(dbOpts)])
                .then(function (_a) {
                var id = _a[0], db = _a[1];
                var mockCEV = {
                    signRawTransaction: function (txString, paths) {
                        return Promise.resolve(sign_1.transactionSigner(id, txString, paths).txid);
                    }
                };
                var rpc = RPC_1.makeRPC(mockCEV, db, id);
                return rpc.manageRequest(test.request);
            })
                .then(function (resp) {
                expect(resp).toEqual(test.response);
            })
                .catch(function () {
                expect(null).toEqual(test.response);
            });
        });
    });
});
//# sourceMappingURL=rpc.specs.js.map