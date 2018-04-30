"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("./../types");
exports.NO_RESPONSE = null;
const tests = [
    // ECHO for imprinter
    {
        scenario: 'imprinted-only',
        description: 'ECHO for imprinter',
        request: {
            sender: 'mu1NE35VDZi8jFkKiPZmnmhK1FEAwiBbbU',
            body: {
                method: 31,
                params: 'abc',
                id: 1
            }
        },
        response: {
            sender: 'mgofddcZaSpuoDiYxgPRVaYNNjsXbKKCsL',
            body: {
                result: 'abc',
                error: types_1.ERROR_NONE,
                id: 1
            }
        }
    },
    // unimplemented method for imprinter
    {
        scenario: 'imprinted-only',
        description: 'imprinter asks for unimplemented method',
        request: {
            sender: 'mu1NE35VDZi8jFkKiPZmnmhK1FEAwiBbbU',
            body: {
                method: 11,
                params: 'abc',
                id: 2
            }
        },
        response: {
            sender: 'mgofddcZaSpuoDiYxgPRVaYNNjsXbKKCsL',
            body: {
                result: types_1.BLANK_RESULT,
                error: types_1.ERROR_METHOD_NOT_IMPLEMENTED,
                id: 2
            }
        }
    },
    // rejects ECHO for unknown
    {
        scenario: 'imprinted-only',
        description: 'rejects ECHO for unknown',
        request: {
            sender: 'XXX',
            body: {
                method: 31,
                params: 'abc',
                id: 3
            }
        },
        response: exports.NO_RESPONSE
    },
    // rejects unimplemented method for unknown
    {
        scenario: 'imprinted-only',
        description: 'rejects unimplemented method for unknown',
        request: {
            sender: 'XXX',
            body: {
                method: 11,
                params: 'xyz',
                id: 4
            }
        },
        response: exports.NO_RESPONSE
    }
];
exports.default = tests;
//# sourceMappingURL=tests.js.map