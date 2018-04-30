"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var path = require("path");
var BcoinID_1 = require("./../../../BcoinID");
var sign_1 = require("./../sign");
describe('sign TX', function () {
    it('signs transaction', function () { return __awaiter(_this, void 0, void 0, function () {
        var unsignedRawTX, expected, paths, id, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    unsignedRawTX = '010000000136c5a79de0dac41a7c1e9c4d5c833c7633ab540451443909a7d9f9bc758e60d8000000004847304402207fffffffffffffffffffffffffffffff5d576e7357a4501ddfe92f46681b20a002207fffffffffffffffffffffffffffffff5d576e7357a4501ddfe92f46681b20a001ffffffff0410270000000000001976a914f5ec6511ca44bab954bb1d6c97e55f5b7178941d88ac0000000000000000536a4c50000000004000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000030750000000000001976a914f5ec6511ca44bab954bb1d6c97e55f5b7178941d88acf07e0e00000000001976a9140fc863841cf1ec7fcadf8364c33c32187c87d9da88ac00000000';
                    expected = '2164fa1d4257a353140c8b219bf0aa711943eef3d013a7b5be38e40bea34ff94' // ( `0 - ${expected}` )
                    ;
                    paths = ['0/0/0'].map(function (p) { return p.split('/'); });
                    return [4 /*yield*/, BcoinID_1.makeBcoinID({ home: path.join(__dirname, 'sign_home_test_1') })];
                case 1:
                    id = _a.sent();
                    result = sign_1.transactionSigner(id, unsignedRawTX, paths);
                    expect(result.txid).toEqual(expected);
                    return [2 /*return*/];
            }
        });
    }); });
    it('signs transaction', function () { return __awaiter(_this, void 0, void 0, function () {
        var unsignedRawTX, expected, paths, id, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    unsignedRawTX = '0100000001eefaf2940cfcd15a8c18727a0f83ec44849318e329d62f3b84a6b186f72c0e3b000000004847304402207fffffffffffffffffffffffffffffff5d576e7357a4501ddfe92f46681b20a002207fffffffffffffffffffffffffffffff5d576e7357a4501ddfe92f46681b20a001ffffffff0410270000000000001976a914853711887a6279268212c2323e54c00d2c8f809688ac0000000000000000536a4c50000000004000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000030750000000000001976a914853711887a6279268212c2323e54c00d2c8f809688acf07e0e00000000001976a9147638f2498957582602020dce44a6a8587be97f3988ac00000000';
                    expected = 'f45e14de75a77d2f825821d4b2078aca10f7dbf90ba1452d7f3fd7c3e2cdbc67' // ( `0 - ${expected}` )
                    ;
                    paths = ['0/0/0'].map(function (p) { return p.split('/'); });
                    return [4 /*yield*/, BcoinID_1.makeBcoinID({ home: path.join(__dirname, 'sign_home_test_2') })];
                case 1:
                    id = _a.sent();
                    result = sign_1.transactionSigner(id, unsignedRawTX, paths);
                    expect(result.txid).toEqual(expected);
                    return [2 /*return*/];
            }
        });
    }); });
    // TODO: splittare il codice di sign in sotto procedure: una può tornare la raw tx firmata per passare il seguente test
    // it('signs transaction', () => {
    //   // https://github.com/uniquid/uidcore-c/blob/master/tests.c#L476
    //   const unsignedRawTX =
    //     '010000000247a327c7f5d626a7159c5c0fccf90732ba733ab6e9eea53db24c4829b3cc46a40000000000ffffffffced72f216e191ebc3be3b7b8c5d8fc0a7ac52fa934e395f837a28f96df2d8f900100000000ffffffff0140420f00000000001976a91457c9afb8bc5e4fa738f5b46afcb51b43a48b270988ac00000000'
    //   const masterPrivKeyForSign =
    //     'tprv8ZgxMBicQKsPeUjbnmwN54rKdA1UCsoJsY3ngzhVxyqeTV5pPNo77heffPbSfWVy8vLkTcMwpQHTxJzjz8euKsdDzETM5WKyKFYNLxMAcmQ'
    //   const expected =
    //     '010000000247a327c7f5d626a7159c5c0fccf90732ba733ab6e9eea53db24c4829b3cc46a4000000006a473044022014fac39447707341f16cac6fcd9a7258dcc636767016e225c5bb2a2ed4462f4c02202867a07f0695109b47cd9de86d06393c9f3f1f0ebbde5f3f7914f5296edf1be4012102461fb3538ffec054fd4ee1e9087e7debf8442028f941bda308c24b508cbf69f7ffffffffced72f216e191ebc3be3b7b8c5d8fc0a7ac52fa934e395f837a28f96df2d8f90010000006a473044022061e3c20622dcbe8ea3a62c66ba56da91c4f1083b11bbd6e912df81bc92826ac50220631d302f309a1c5212933830f910ba2931ff32a5b41a2c9aaa808b926aa99363012102ece5ce70796b6893283aa0c8f30273c7dc0ff0b82a75017285387ecd2d767110ffffffff0140420f00000000001976a91457c9afb8bc5e4fa738f5b46afcb51b43a48b270988ac00000000' // ( `0 - ${expected}` )
    //   const paths = ['0/0/0', '0/0/1'].map(p => p.split('/'))
    //   const id = BcoinID({ privateKey: masterPrivKeyForSign })
    //   const result = sign(id)(unsignedRawTX, paths)
    //   expect(result).toEqual(expected)
    // })
});
//# sourceMappingURL=sign.specs.js.map