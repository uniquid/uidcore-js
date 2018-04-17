import * as path from 'path'
import { makeRPC } from '../RPC'
import { CH } from './../../../../CH'
import { makeBcoinDB } from './../../../Bcoin/BcoinDB'
import { BcoinID } from './../../../Bcoin/BcoinID'
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
        home: path.join(scenarioDir, 'id_home'),
      }
      const dbOpts = {
        home: path.join(scenarioDir, 'db_home'),
      }

      return Promise.all([BcoinID(idOpts), makeBcoinDB(dbOpts)])
        .then(([id, db]) => {
          const ch = CH({}, db, id)
          const rpc = makeRPC(ch)

          return rpc.manageRequest(test.request)
        })
        .then(resp => {
          expect(resp).toEqual(test.response)
        })
    })
  )
})
