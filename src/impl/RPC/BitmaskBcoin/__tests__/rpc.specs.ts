import * as path from 'path'
import { sign } from '../../../Bcoin/BcoinCEV/TX/sign'
import { HDPath } from '../../../Bcoin/BcoinID/HD'
import { makeRPC } from '../RPC'
import { makeBcoinDB } from './../../../Bcoin/BcoinDB'
import { BcoinID } from './../../../Bcoin/BcoinID'
import { BcoinCEV } from './../../../Bcoin/types/BcoinCEV'
import tests from './tests'
describe('RPC', () => {
  tests.forEach(test =>
    it(`
        scenario: ${test.scenario}
        description: ${test.description}
        method: ${test.request.body.method}
        sender: ${test.request.sender}`, () => {
      const scenarioDir = path.join(__dirname, 'scenarios', test.scenario)
      const idOpts = {
        home: path.join(scenarioDir, 'id_home')
      }
      const dbOpts = { home: path.join(scenarioDir, 'db_home') }

      return Promise.all([BcoinID(idOpts), makeBcoinDB(dbOpts)])
        .then(([id, db]) => {
          const mockCEV: BcoinCEV = {
            sign: (txString: string, paths: HDPath[]) => Promise.resolve(sign(id)(txString, paths).txid)
          }
          const rpc = makeRPC(mockCEV, db, id)

          return rpc.manageRequest(test.request)
        })
        .then(resp => {
          expect(resp).toEqual(test.response)
        })
    })
  )
})
