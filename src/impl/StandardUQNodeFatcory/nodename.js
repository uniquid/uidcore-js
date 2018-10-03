"use strict";
exports.__esModule = true;
var crypto = require("crypto");
var fs_1 = require("fs");
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
    if (!fs_1.existsSync(config.home)) {
        fs_1.mkdirSync(config.home);
    }
    var nodenameFilePath = path.join(config.home, exports.NODE_NAME_FILE);
    var exists = fs_1.existsSync(nodenameFilePath);
    var nodename;
    if (exists) {
        nodename = fs_1.readFileSync(nodenameFilePath, 'UTF8');
    }
    else {
        nodename = exports.generateUniqueName(config.prefix);
        fs_1.writeFileSync(nodenameFilePath, nodename, { encoding: 'UTF8' });
    }
    return nodename;
};
