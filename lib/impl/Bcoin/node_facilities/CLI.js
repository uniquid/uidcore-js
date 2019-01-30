#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DEFAULT_HOST = 'http://dbs-ltc-testnet.uniquid.co';
var program = require("commander");
var checkBackupFileMD5_1 = require("./checkBackupFileMD5");
var downloadBackup_1 = require("./downloadBackup");
var injectTarball_1 = require("./injectTarball");
program
    .command('download <testnet|regtest>')
    .option('-h, --host <url>', "download from host (efaults to " + DEFAULT_HOST + ")")
    .option('-b, --block <int>', 'at block (if exists ;) )')
    .option('-o, --output <file>', 'target output filename')
    .description("downloads LTC headers backup tarball and corresponding md5 checksum")
    .action(download)
    .on('--help', function () {
    console.log("\ndownloads LTC headers backup tarball and corresponding md5 checksum,\nchecks downloaded tarball's md5 sum to match\nsaves tarball and corresponding md5\ncleans up on error or md5 no match\n\nNote: if using --block option, you should choose a specific height backup present in referenced host.\nUniquId is not backupping at all and each Blockchain height ( feel free to browse @ " + DEFAULT_HOST + " )\n\nExamples usage:\n\n# downloads latest testnet's headers and saves them in cwd\n$ " + program.name() + " download testnet\n\n# downloads testnet's headers at block 40000\n$ " + program.name() + " download testnet -b 40000\n\n# save files as /target/filename.tgz and /target/filename.tgz_md5\n$ " + program.name() + " download testnet -b 40000 -o /target/filename\n");
});
program
    .command('inject <backup-file>')
    .option('-t, --target <dir>', 'target node home')
    .description('extracts and injects a LTC headers backup tarball into a node home directory')
    .action(injectInNodeHome)
    .on('--help', function () {
    console.log("\nExamples usage:\n\n# extract and inject path/to/chaindb/tarball.tgz headers DB in cwd\n$ " + program.name() + " inject path/to/chaindb/tarball.tgz\n\n# extract and inject path/to/chaindb/tarball.tgz headers DB in path/to/node/home/dir\n$ " + program.name() + " inject path/to/chaindb/tarball.tgz -t path/to/node/home/dir\n");
});
program
    .command('install <testnet|regtest>')
    .option('-b, --block <int>', 'at block (if exists ;) )')
    .option('-o, --output <file>', 'target output filename')
    .option('-t, --target <dir>', 'target node home')
    .option('-h, --host <url>', "download from host (defaults to " + DEFAULT_HOST + ")")
    .description("download and inject LTC headers backup into a node home directory")
    .action(function (network, options) {
    download(network, options).then(function (_) { return injectInNodeHome(_.backupFile, options); }).catch(exitError);
})
    .on('--help', function () {
    console.log("\ndownload and inject LTC headers backup into a node home directory\nit is foundamentally a sequence of <ltc-backup download> and <ltc-backup inject>\noptions for the two commands apply here too\n\nNote: if using --block option, you should choose a specific height backup present in referenced host.\nUniquId is not backupping at all and each Blockchain height ( feel free to browse @ " + DEFAULT_HOST + " )\n\nExamples usage:\n\n# installs latest testnet's headers DB in cwd\n$ " + program.name() + " inject path/to/chainbb/tarball.tgz\n\n# installs latest testnet's headers DB in path/to/node/home/dir\n$ " + program.name() + " inject path/to/chainbb/tarball.tgz -t path/to/node/home/dir\n");
});
// program.on('command:*', function () {
//   program.help()
//   exitError(`Invalid command: ${program.args.join(' ')}\nSee --help for a list of available commands.`);
// });
program.action(function () { return program.help(); }).on('--help', function () {
    console.log("\ncheckout commands help:\n$ " + program.name() + " download --help\n$ " + program.name() + " inject --help\n$ " + program.name() + " install --help\n");
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