#!/usr/bin/env node

const DEFAULT_HOST = 'http://dbs-ltc-testnet.uniquid.co'

import * as program from 'commander'
import checkBackupFileMD5 from './checkBackupFileMD5'
import downloadBackup from './downloadBackup'
import injectTarball from './injectTarball'

program
  .command('download <testnet|regtest>')
  .option('-h, --host <url>', `download from host (efaults to ${DEFAULT_HOST})`)
  .option('-b, --block <int>', 'at block (if exists ;) )')
  .option('-o, --output <file>', 'target output filename')
  .description(`downloads LTC headers backup tarball and corresponding md5 checksum`)
  .action(download)
  .on('--help', function() {
    console.log(`
downloads LTC headers backup tarball and corresponding md5 checksum,
checks downloaded tarball's md5 sum to match
saves tarball and corresponding md5
cleans up on error or md5 no match

Note: if using --block option, you should choose a specific height backup present in referenced host.
UniquId is not backupping at all and each Blockchain height ( feel free to browse @ ${DEFAULT_HOST} )

Examples usage:

# downloads latest testnet's headers and saves them in cwd
$ ${program.name()} download testnet

# downloads testnet's headers at block 40000
$ ${program.name()} download testnet -b 40000

# save files as /target/filename.tgz and /target/filename.tgz_md5
$ ${program.name()} download testnet -b 40000 -o /target/filename
`)
  })

program
  .command('inject <backup-file>')
  .option('-t, --target <dir>', 'target node home')
  .description('extracts and injects a LTC headers backup tarball into a node home directory')
  .action(injectInNodeHome)
  .on('--help', function() {
    console.log(`
Examples usage:

# extract and inject path/to/chaindb/tarball.tgz headers DB in cwd
$ ${program.name()} inject path/to/chaindb/tarball.tgz

# extract and inject path/to/chaindb/tarball.tgz headers DB in path/to/node/home/dir
$ ${program.name()} inject path/to/chaindb/tarball.tgz -t path/to/node/home/dir
`)
  })

program
  .command('install <testnet|regtest>')
  .option('-b, --block <int>', 'at block (if exists ;) )')
  .option('-o, --output <file>', 'target output filename')
  .option('-t, --target <dir>', 'target node home')
  .option('-h, --host <url>', `download from host (defaults to ${DEFAULT_HOST})`)
  .description(`download and inject LTC headers backup into a node home directory`)
  .action((network, options) => {
    download(network, options).then(_ => injectInNodeHome(_.backupFile, options)).catch(exitError)
  })
  .on('--help', function() {
    console.log(`
download and inject LTC headers backup into a node home directory
it is foundamentally a sequence of <ltc-backup download> and <ltc-backup inject>
options for the two commands apply here too

Note: if using --block option, you should choose a specific height backup present in referenced host.
UniquId is not backupping at all and each Blockchain height ( feel free to browse @ ${DEFAULT_HOST} )

Examples usage:

# installs latest testnet's headers DB in cwd
$ ${program.name()} inject path/to/chainbb/tarball.tgz

# installs latest testnet's headers DB in path/to/node/home/dir
$ ${program.name()} inject path/to/chainbb/tarball.tgz -t path/to/node/home/dir
`)
  })

// program.on('command:*', function () {
//   program.help()
//   exitError(`Invalid command: ${program.args.join(' ')}\nSee --help for a list of available commands.`);
// });

program.action(() => program.help()).on('--help', function() {
  console.log(`
checkout commands help:
$ ${program.name()} download --help
$ ${program.name()} inject --help
$ ${program.name()} install --help
`)
})
function injectInNodeHome(tarball: string, opts: { target?: string }) {
  const target = typeof opts.target === 'string' ? String(opts.target) : '.'
  console.log(`Install ${tarball} in ${target}`)

  return injectTarball({
    tarballFile: tarball,
    extractTo: target
  }).catch(e => exitError(`Installation failed`, e))
}

function download(network: string, opts: { block: string; host?: string; output?: string }) {
  if (!['testnet', 'regtest'].includes(network)) {
    exitError(`invalid network argument: ${network}, it should be one of <testnet|regtest>`)
  }
  let blockNumber
  if ('block' in opts) {
    // tslint:disable-next-line:no-magic-numbers
    blockNumber = parseInt(opts.block, 10)
    if (!blockNumber || `${blockNumber}` !== opts.block.replace(/^0*/, '')) {
      exitError(`invalid block option: ${opts.block}, it should be an integer > 0`)
    }
  }
  console.log('download', network, blockNumber || 'latest')

  return downloadBackup({
    blockNumber,
    network,
    host: opts.host || DEFAULT_HOST,
    saveAs: opts.output
  })
    .catch(e => {
      throw new Error(exitError('Could not download backup files', e))
    })
    .then(checkBackupFileMD5)
    .catch(e => {
      throw new Error(exitError('MD5 check failed', e))
    })
}

function exitError(msg: string, error?: any) {
  const errStr = `${msg || ''}\n${error || ''}`
  console.error(errStr)
  process.exit(error ? 1 : 0)

  return errStr
}
program.version('0.0.1').parse(process.argv).parseExpectedArgs(process.argv).allowUnknownOption(false)
