"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var crypto = require("crypto");
var fs = require("fs");
var path = require("path");
exports.NAME_LENGTH = 12;
exports.generateUniqueName = (function () {
    var RND_BYTES_LENGTH = 6;
    var HEX_BASE = 16;
    var generate = function (prefix) {
        if (prefix === void 0) { prefix = ''; }
        return prefix +
            crypto
                .randomBytes(RND_BYTES_LENGTH)
                .readUIntBE(0, RND_BYTES_LENGTH)
                .toString(HEX_BASE)
                .padStart(exports.NAME_LENGTH, '0')
                .toUpperCase();
    };
    return generate;
})();
exports.NODE_NAME_FILE = 'node.name';
exports.getNodeName = function (config) {
    var nodenameFilePath = path.join(config.home, exports.NODE_NAME_FILE);
    var exists = fs.existsSync(nodenameFilePath);
    var nodename;
    if (exists) {
        nodename = fs.readFileSync(nodenameFilePath, 'UTF8');
    }
    else {
        nodename = exports.generateUniqueName(config.prefix);
        fs.writeFileSync(nodenameFilePath, nodename, { encoding: 'UTF8' });
    }
    return nodename;
};
//# sourceMappingURL=nodename.js.map