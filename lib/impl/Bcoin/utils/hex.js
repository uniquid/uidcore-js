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
exports.rawHexStringToIntArray = function (raw) {
    var rawHexStrArray = [];
    var idx = 0;
    while (idx < raw.length) {
        // tslint:disable-next-line:no-magic-numbers
        rawHexStrArray.push(Array.prototype.slice.call(raw, idx, (idx += 2)).join(''));
    }
    // tslint:disable-next-line:no-magic-numbers
    return rawHexStrArray.map(function (hex) { return parseInt(hex, 16); });
};
var padHex = function (hex) { return (hex.length === 1 ? "0" + hex : hex); };
exports.intArrayToRawHexString = function (tx) {
    return tx
        // tslint:disable-next-line:no-magic-numbers
        .map(function (n) { return padHex(n.toString(16)); })
        .join('');
};
//# sourceMappingURL=hex.js.map