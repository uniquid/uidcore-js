"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var request_1 = require("request");
exports.importDb = function (_a) {
    var atBlock = _a.atBlock, _b = _a.network, network = _b === void 0 ? 'testnet' : _b, host = _a.host;
    var dbFileUrl;
    if (atBlock === false) {
        dbFileUrl = host + "/" + network + "_db_latest.tgz";
    }
    else {
        // tslint:disable-next-line:no-magic-numbers
        dbFileUrl = host + "/" + network + "//db_" + ("" + atBlock).padStart(9, '0') + ".tgz";
    }
    return request_1.default(dbFileUrl);
};
//# sourceMappingURL=downloadChainDb.1.js.map