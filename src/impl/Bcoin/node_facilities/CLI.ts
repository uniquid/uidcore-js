#!/usr/bin/env node

const DEFAULT_HOST = 'http://35.180.120.244'

import * as program from 'commander'
import checkBackupFileMD5 from './checkBackupFileMD5'
import downloadBackup from './downloadBackup'
import injectTarball from './injectTarball'

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
    download(network, options).then(_ => injectInNodeHome(_.backupFile, options)).catch(exitError)
  })

program.command('*').action(cmd => {
  exitError(`command <${cmd}> not implemented`)
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
  console.log('download', network, blockNumber)

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
