"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// http://wiki.uniquid.com/books/uniquid-achitecture-v01-using-uidcore-c/page/architettura-generale
exports.VERSION_BYTE_LENGTH = 1;
exports.SYSTEM_RESERVED_RPC_FUNCS_BYTE_LENGTH = 4;
exports.USER_DEFINED_RPC_FUNCS_BYTE_LENGTH = 14;
exports.GUARANTORS_AMT_BYTE_LENGTH = 1;
exports.GUARANTOR_ADDRESS_BYTE_LENGTH = 20;
exports.GUARANTOR_ADDRESSES_AMT = 3;
exports.PAYLOAD_LENGTH = exports.VERSION_BYTE_LENGTH +
    exports.SYSTEM_RESERVED_RPC_FUNCS_BYTE_LENGTH +
    exports.USER_DEFINED_RPC_FUNCS_BYTE_LENGTH +
    exports.GUARANTORS_AMT_BYTE_LENGTH +
    exports.GUARANTOR_ADDRESS_BYTE_LENGTH * exports.GUARANTOR_ADDRESSES_AMT; // 80
exports.FULL_ACCESS_BYTE = 255;
// export const ImprintingPayload: Payload = Array.from(
//   Buffer.concat(
//     [
//       Buffer.alloc(VERSION_BYTE_LENGTH),
//       Buffer.alloc(SYSTEM_RESERVED_RPC_FUNCS_BYTE_LENGTH + USER_DEFINED_RPC_FUNCS_BYTE_LENGTH, FULL_ACCESS_BYTE),
//       Buffer.alloc(GUARANTORS_AMT_BYTE_LENGTH + GUARANTOR_ADDRESS_BYTE_LENGTH * GUARANTOR_ADDRESSES_AMT)
//     ],
//     PAYLOAD_LENGTH
//   )
// )
//# sourceMappingURL=PayloadDef.js.map