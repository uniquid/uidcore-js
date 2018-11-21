"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable-next-line:no-require-imports
var compressing = require('compressing');
exports.default = injectTarball;
function injectTarball(_) {
    return compressing.tgz.uncompress(_.tarballFile, _.extractTo);
}
exports.injectTarball = injectTarball;
//# sourceMappingURL=injectTarball.1.js.map