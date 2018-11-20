"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBackupFilenames = function (_a) {
    var blockNumber = _a.blockNumber, _b = _a.network, network = _b === void 0 ? 'testnet' : _b, host = _a.host;
    var dbFileUrl;
    var md5FileUrl;
    if (blockNumber === false) {
        dbFileUrl = host + "/" + network + "_db_latest.tgz";
        md5FileUrl = host + "/" + network + "_checkpoints_latest";
    }
    else {
        // tslint:disable-next-line:no-magic-numbers
        var paddedBlockNumber = ("" + blockNumber).padStart(9, '0');
        dbFileUrl = host + "/" + network + "/db_" + paddedBlockNumber + ".tgz";
        md5FileUrl = host + "/" + network + "/checkpoints_" + paddedBlockNumber;
    }
    return {
        dbFileUrl: dbFileUrl,
        md5FileUrl: md5FileUrl
    };
};
//# sourceMappingURL=backupFilename.js.map