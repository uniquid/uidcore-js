"use strict";
exports.__esModule = true;
exports.BLANK_RESULT = '';
exports.ERROR_METHOD_NOT_IMPLEMENTED = 5;
exports.ERROR_NOT_AUTHORIZED = 4;
exports.ERROR_NONE = 0;
exports.isRequest = function (msg) { return 'method' in msg.body; };
