const program = require('commander')
const cliProgress = require('cli-progress');
const downloadChainDb = require('../lib/impl/Bcoin/node_facilities/downloadChainDb')
const checkMD5 = require('../lib/impl/Bcoin/node_facilities/checkMD5')
const extractChainDB = require('../lib/impl/Bcoin/node_facilities/extractChainDB')

program
  .option('-n, --network', 'the LTC Network', /^(a|b)$/i, 'a')
  .option('-b, --block', 'at block', Number)
  .option('-s, --saveto', 'dest file')
  //.parse(process.argv)

  program
  .command('y')
  .action(function () {
    console.log('y',arguments)
  })

  program
  .command('x')
  .action(function () {
    console.log('x',arguments)
  })

