/**!
 *
 * Copyright 2016-2018 Uniquid Inc. or its affiliates. All Rights Reserved.
 *
 * License is in the "LICENSE" file accompanying this file.
 * See the License for the specific language governing permissions and limitations under the License.
 *
 */
import * as path from 'path'
import { transactionSigner } from '../../../Bcoin/BcoinCEV/TX/sign'
import { HDPath } from '../../../Bcoin/BcoinID/HD'
import { makeRPC } from '../RPC'
import { makeBcoinDB } from './../../../Bcoin/BcoinDB'
import { makeBcoinID, Options as IDOptions } from './../../../Bcoin/BcoinID'
import { BcoinCEV } from './../../../Bcoin/types/BcoinCEV'
import tests from './tests'
describe('RPC', () => {
  tests.forEach(test =>
    it(`
        scenario: ${test.scenario}
        description: ${test.description}
        method: ${test.request.body.method}`, () => {
      // sender: ${test.request.sender}`,() => {
      const scenarioDir = path.join(__dirname, 'scenarios', test.scenario)
      const idOpts: IDOptions = {
        home: path.join(scenarioDir, 'id_home'),
        network: 'uqregtest'
      }
      const dbOpts = { home: path.join(scenarioDir, 'db_home') }

      return Promise.all([makeBcoinID(idOpts), makeBcoinDB(dbOpts)])
        .then(([id, db]) => {
          const mockCEV: BcoinCEV = {
            signRawTransaction: (txString: string, paths: HDPath[]) =>
              Promise.resolve(transactionSigner(id, txString, paths).txid)
          }
          const rpc = makeRPC(mockCEV, db, id)

          return rpc.manageRequest(test.request)
        })
        .then(resp => {
          expect(resp).toEqual(test.response)
        })
        .catch(() => {
          expect(null).toEqual(test.response)
        })
    })
  )
})
