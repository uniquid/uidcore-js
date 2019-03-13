"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var types_1 = require("./../types");
exports.NO_RESPONSE = null;
var tests = [
    // ECHO for imprinter
    {
        scenario: 'imprinted-only',
        description: 'ECHO for imprinter',
        request: {
            // sender: 'mu1NE35VDZi8jFkKiPZmnmhK1FEAwiBbbU',
            body: {
                method: 31,
                params: 'abc',
                id: 1
            },
            signature: ''
        },
        response: {
            requester: 'mu1NE35VDZi8jFkKiPZmnmhK1FEAwiBbbU',
            body: {
                result: 'abc',
                error: types_1.ERROR_NONE,
                id: 1
            },
            signature: ''
        }
    },
    // unimplemented method for imprinter
    {
        scenario: 'imprinted-only',
        description: 'imprinter asks for unimplemented method',
        request: {
            // sender: 'mu1NE35VDZi8jFkKiPZmnmhK1FEAwiBbbU',
            body: {
                method: 11,
                params: 'abc',
                id: 2
            },
            signature: ''
        },
        response: {
            requester: 'mu1NE35VDZi8jFkKiPZmnmhK1FEAwiBbbU',
            // 'mgofddcZaSpuoDiYxgPRVaYNNjsXbKKCsL',
            body: {
                result: types_1.BLANK_RESULT,
                error: types_1.ERROR_METHOD_NOT_IMPLEMENTED,
                id: 2
            },
            signature: ''
        }
    },
    // rejects ECHO for unknown
    {
        scenario: 'imprinted-only',
        description: 'rejects ECHO for unknown',
        request: {
            // sender: 'XXX',
            body: {
                method: 31,
                params: 'abc',
                id: 3
            },
            signature: ''
        },
        response: exports.NO_RESPONSE
    },
    // rejects unimplemented method for unknown
    {
        scenario: 'imprinted-only',
        description: 'rejects unimplemented method for unknown',
        request: {
            // sender: 'XXX',
            body: {
                method: 11,
                params: 'xyz',
                id: 4
            },
            signature: ''
        },
        response: exports.NO_RESPONSE
    }
];
exports.default = tests;
//# sourceMappingURL=tests.js.map