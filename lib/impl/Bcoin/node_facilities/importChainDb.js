"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = require("fs");
var path_1 = require("path");
var tar_fs_1 = require("tar-fs");
exports.importDb = function (_) { return fs_1.default.createReadStream(_.absoluteTarFileName).pipe(tar_fs_1.default.extract(path_1.default.join(_.absoluteNodeHomeDir, 'chain.db'))); };
//# sourceMappingURL=importChainDb.js.map