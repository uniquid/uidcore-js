"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable-next-line:no-require-imports
var compressing = require('compressing');
function extractChainDBTarball(_) {
    return compressing.tgz.uncompress(_.tarballFile, _.extractTo);
}
exports.extractChainDBTarball = extractChainDBTarball;
//# sourceMappingURL=extractChainDB.js.map