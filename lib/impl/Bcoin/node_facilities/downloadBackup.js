"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var request = require("request");
// tslint:disable-next-line:no-require-imports
var progress = require('request-progress');
var cliProgress = require("cli-progress");
var fs_1 = require("fs");
exports.default = downloadBackup;
function downloadBackup(_) {
    var backupFilename = getBackupFilename(_);
    var baseFileUrl = _.host + "/" + backupFilename;
    var baseSaveTo = _.saveAs || backupFilename.replace(/\//g, '_');
    if (!baseSaveTo.endsWith('.tgz')) {
        baseSaveTo = baseSaveTo + ".tgz";
    }
    return dl(baseFileUrl + "_md5", baseSaveTo + "_md5").then(function () { return dl(baseFileUrl, "" + baseSaveTo); }).then(function () { return ({
        checksumFile: baseSaveTo + "_md5",
        backupFile: baseSaveTo
    }); });
}
exports.downloadBackup = downloadBackup;
function dl(url, toFile) {
    console.log("Downloading " + url);
    return new Promise(function (resolve, reject) {
        var progressBar = new cliProgress.Bar({}, cliProgress.Presets.shades_classic);
        var dlReq = request(url);
        progress(dlReq)
            .on('response', function (response) {
            // tslint:disable-next-line:no-magic-numbers
            if (response.statusCode !== 200) {
                progressBar.stop();
                dlReq.abort();
                cleanupAndReject(response.statusMessage);
            }
        })
            .on('request', function () {
            // tslint:disable-next-line:no-magic-numbers
            progressBar.start(100, 0);
        })
            .on('progress', function (state) {
            // tslint:disable-next-line:no-magic-numbers
            progressBar.update(Number((state.percent * 100).toFixed(5)));
        })
            .on('error', function (err) {
            progressBar.stop();
            cleanupAndReject(err);
        })
            .on('end', function () {
            // tslint:disable-next-line:no-magic-numbers
            progressBar.update(100);
            progressBar.stop();
            resolve(null);
        })
            .pipe(fs_1.createWriteStream(toFile));
        function cleanupAndReject(err) {
            reject(err);
            // tslint:disable-next-line:no-empty
            fs_1.unlink(toFile, function () { });
        }
    });
}
function getBackupFilename(_a) {
    var blockNumber = _a.blockNumber, network = _a.network;
    var dbFileUrl;
    if (!blockNumber) {
        dbFileUrl = network + "_db_latest.tgz";
    }
    else {
        // tslint:disable-next-line:no-magic-numbers
        var paddedBlockNumber = ("" + blockNumber).padStart(9, '0');
        dbFileUrl = network + "/db_" + paddedBlockNumber + ".tgz";
    }
    return dbFileUrl;
}
exports.getBackupFilename = getBackupFilename;
//# sourceMappingURL=downloadBackup.js.map