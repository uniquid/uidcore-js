require('ts-node').register()
const cev = require('./../../BcoreCEV')
const id = require('./../../BcoreID')
const db = {
  getImprinting: async () => null,
  storeImprinting: async () => null,
  storeOrchestration: async () => null,
  getOrchestration: async () => null,
}
const pkFile = __dirname + '/PrivK'
console.log(pkFile)
cev.makeBcoreCEV(db, id.BcoreID({ pkFile }), { pool: { logLevel: 'warning' } })
