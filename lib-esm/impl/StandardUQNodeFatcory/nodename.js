"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
exports.NAME_LENGTH = 12;
exports.generateUniqueName = (() => {
    const RND_BYTES_LENGTH = 6;
    const HEX_BASE = 16;
    const generate = (prefix = '') => prefix +
        crypto
            .randomBytes(RND_BYTES_LENGTH)
            .readUIntBE(0, RND_BYTES_LENGTH)
            .toString(HEX_BASE)
            .padStart(exports.NAME_LENGTH, '0')
            .toUpperCase();
    return generate;
})();
exports.NODE_NAME_FILE = 'node.name';
exports.getNodeName = (config) => {
    const nodenameFilePath = path.join(config.home, exports.NODE_NAME_FILE);
    const exists = fs.existsSync(nodenameFilePath);
    let nodename;
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