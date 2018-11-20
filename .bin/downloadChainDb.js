const HOST = 'http://35.180.120.244'

const program = require('commander')
const downloadBackup = require('../lib/impl/Bcoin/node_facilities/downloadBackup')
const extractChainDB = require('../lib/impl/Bcoin/node_facilities/extractChainDB')

program
  .command('download <testnet|regtest>')
  .option('-b, --block <int>', 'at block')
  .option('-t, --target <path>', 'target filename')
  .description('download LTC headers backup')
  .action(download);

function download(network, opts) {
  if(!['testnet','regtest'].includes(network)){
    console.error(`invailid network argument: ${network}, it should be one of <testnet|regtest>`)
    process.exit(1)
  }
  let blockNumber;
  if('block' in opts){
    blockNumber = parseInt(opts.block)
    if(!blockNumber || `${blockNumber}` !== opts.block.replace(/^0*/,'')){
      console.error(`invalid block option: ${opts.block}, it should be an integer > 0`)
      process.exit(1)
    }
  }
  console.log('download', network, blockNumber);
  const reqs = downloadBackup.default({
    blockNumber,
    network,
    host: HOST,
    saveAs: opts.target
  })
  .then(console.log,console.error)
}
program
  .version('0.0.1')
  .parse(process.argv)
  .parseExpectedArgs(process.argv)
  .allowUnknownOption(false)



