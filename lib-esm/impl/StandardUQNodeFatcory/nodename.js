"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**!
 *
 * Copyright 2016-2018 Uniquid Inc. or its affiliates. All Rights Reserved.
 *
 * License is in the "LICENSE" file accompanying this file.
 * See the License for the specific language governing permissions and limitations under the License.
 *
 */
const crypto = require("crypto");
const fs_1 = require("fs");
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
    if (!fs_1.existsSync(config.home)) {
        fs_1.mkdirSync(config.home);
    }
    const nodenameFilePath = path.join(config.home, exports.NODE_NAME_FILE);
    const exists = fs_1.existsSync(nodenameFilePath);
    let nodename;
    if (exists) {
        nodename = fs_1.readFileSync(nodenameFilePath, 'UTF8');
    }
    else {
        nodename = exports.generateUniqueName(config.prefix);
        fs_1.writeFileSync(nodenameFilePath, nodename, { encoding: 'UTF8' });
    }
    return nodename;
};
//# sourceMappingURL=nodename.js.map