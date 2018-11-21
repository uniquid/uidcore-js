const DEFAULT_HOST = 'http://35.180.120.244'

const program = require('commander')
const downloadBackup = require('../lib/impl/Bcoin/node_facilities/downloadBackup')
const injectTarball = require('../lib/impl/Bcoin/node_facilities/injectTarball')
const checkBackupFileMD5 = require('../lib/impl/Bcoin/node_facilities/checkBackupFileMD5')

program
  .command('download <testnet|regtest>')
  .option('-h, --host <url>', `download from host (efaults to ${DEFAULT_HOST})`)
  .option('-b, --block <int>', 'at block')
  .option('-o, --output <file>', 'target output filename')
  .description('download LTC headers backup')
  .action(download)

program
  .command('inject <backup-file>')
  .option('-t, --target <dir>', 'target node home')
  .description('injects a LTC headers backup tarball into a node home directory')
  .action(injectInNodeHome)

program
  .command('install <testnet|regtest>')
  .option('-b, --block <int>', 'at block')
  .option('-o, --output <file>', 'target output filename')
  .option('-t, --target <dir>', 'target node home')
  .option('-h, --host <url>', `download from host (efaults to ${DEFAULT_HOST})`)
  .description('download and inject LTC headers backup into a node home directory')
  .action((network, options) => {
    download(network, options).then(_ => injectInNodeHome(_.backupFile, options))
  })

function injectInNodeHome (tarball, opts) {
  const target = typeof opts.target === 'string' ? String(opts.target) : '.'
  console.log(`Install ${tarball} in ${target}`)
  return injectTarball
    .default({
      tarballFile: tarball,
      extractTo: target
    })
    .catch(e => exitError(`Installation failed`, e))
}

function download (network, opts) {
  if (!['testnet', 'regtest'].includes(network)) {
    exitError(`invailid network argument: ${network}, it should be one of <testnet|regtest>`)
  }
  let blockNumber
  if ('block' in opts) {
    blockNumber = parseInt(opts.block)
    if (!blockNumber || `${blockNumber}` !== opts.block.replace(/^0*/, '')) {
      exitError(`invalid block option: ${opts.block}, it should be an integer > 0`)
    }
  }
  console.log('download', network, blockNumber)
  return downloadBackup
    .default({
      blockNumber,
      network,
      host: opts.host || DEFAULT_HOST,
      saveAs: opts.output
    })
    .catch(e => exitError('Could not download backup files', e))
    .then(checkBackupFileMD5.default)
    .catch(e => exitError('MD5 check failed', e))
}

function exitError (msg, error) {
  console.error(`${msg || ''}\n${error || ''}`)
  process.exit(error ? 1 : 0)
}
program.version('0.0.1').parse(process.argv).parseExpectedArgs(process.argv).allowUnknownOption(false)
