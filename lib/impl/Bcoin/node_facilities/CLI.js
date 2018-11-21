#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DEFAULT_HOST = 'http://35.180.120.244';
var program = require("commander");
var checkBackupFileMD5_1 = require("./checkBackupFileMD5");
var downloadBackup_1 = require("./downloadBackup");
var injectTarball_1 = require("./injectTarball");
program
    .command('download <testnet|regtest>')
    .option('-h, --host <url>', "download from host (efaults to " + DEFAULT_HOST + ")")
    .option('-b, --block <int>', 'at block')
    .option('-o, --output <file>', 'target output filename')
    .description('download LTC headers backup')
    .action(download);
program
    .command('inject <backup-file>')
    .option('-t, --target <dir>', 'target node home')
    .description('injects a LTC headers backup tarball into a node home directory')
    .action(injectInNodeHome);
program
    .command('install <testnet|regtest>')
    .option('-b, --block <int>', 'at block')
    .option('-o, --output <file>', 'target output filename')
    .option('-t, --target <dir>', 'target node home')
    .option('-h, --host <url>', "download from host (efaults to " + DEFAULT_HOST + ")")
    .description('download and inject LTC headers backup into a node home directory')
    .action(function (network, options) {
    download(network, options).then(function (_) { return injectInNodeHome(_.backupFile, options); }).catch(exitError);
});
program.command('*').action(function (cmd) {
    exitError("command <" + cmd + "> not implemented");
});
function injectInNodeHome(tarball, opts) {
    var target = typeof opts.target === 'string' ? String(opts.target) : '.';
    console.log("Install " + tarball + " in " + target);
    return injectTarball_1.default({
        tarballFile: tarball,
        extractTo: target
    }).catch(function (e) { return exitError("Installation failed", e); });
}
function download(network, opts) {
    if (!['testnet', 'regtest'].includes(network)) {
        exitError("invalid network argument: " + network + ", it should be one of <testnet|regtest>");
    }
    var blockNumber;
    if ('block' in opts) {
        // tslint:disable-next-line:no-magic-numbers
        blockNumber = parseInt(opts.block, 10);
        if (!blockNumber || "" + blockNumber !== opts.block.replace(/^0*/, '')) {
            exitError("invalid block option: " + opts.block + ", it should be an integer > 0");
        }
    }
    console.log('download', network, blockNumber);
    return downloadBackup_1.default({
        blockNumber: blockNumber,
        network: network,
        host: opts.host || DEFAULT_HOST,
        saveAs: opts.output
    })
        .catch(function (e) {
        throw new Error(exitError('Could not download backup files', e));
    })
        .then(checkBackupFileMD5_1.default)
        .catch(function (e) {
        throw new Error(exitError('MD5 check failed', e));
    });
}
function exitError(msg, error) {
    var errStr = (msg || '') + "\n" + (error || '');
    console.error(errStr);
    process.exit(error ? 1 : 0);
    return errStr;
}
program.version('0.0.1').parse(process.argv).parseExpectedArgs(process.argv).allowUnknownOption(false);
//# sourceMappingURL=CLI.js.map