"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var download_1 = require("download");
var fs_1 = require("fs");
var path_1 = require("path");
exports.importDb = function (_a) {
    var atBlock = _a.atBlock, saveToAbsoluteDir = _a.saveToAbsoluteDir, renameTo = _a.renameTo, _b = _a.network, network = _b === void 0 ? 'testnet' : _b;
    var dbFileName = "db_" + atBlock + ".tar";
    renameTo = renameTo || dbFileName;
    var destinationFile = path_1.default.resolve(saveToAbsoluteDir, renameTo);
    download_1.default("http://35.180.120.244/" + network + "/" + dbFileName).pipe(fs_1.default.createWriteStream(destinationFile));
};
//# sourceMappingURL=downloadChainDb.js.map