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
const hex_1 = require("./../../utils/hex");
const varint_1 = require("./varint");
const VERSION_LENGTH = 4;
const TX_HASH_LENGTH = 32;
const INPUT_INDEX_LENGTH = 4;
const SEQ_LENGTH = 4;
const splitList = (list, at) => ({
    head: list.slice(0, at),
    tail: list.slice(at)
});
/**
 * parses a raw Hex string or a number[] representing a BC transacton into a {@link TXObj}
 *
 * @param {(number[] | string)} raw
 * @returns {TXObj}
 */
exports.parseTx = (raw) => {
    if ('string' === typeof raw) {
        raw = hex_1.rawHexStringToIntArray(raw);
    }
    let _ = splitList(raw, 0);
    _ = splitList(_.tail, VERSION_LENGTH);
    const { head: version } = _;
    const { res: nInputs, length: nInputsVarintLength } = varint_1.decodeVarInt(_.tail);
    _ = splitList(_.tail, nInputsVarintLength);
    const inputs = [];
    for (let i = 0; i < nInputs; i++) {
        _ = splitList(_.tail, TX_HASH_LENGTH);
        const { head: tx } = _;
        _ = splitList(_.tail, INPUT_INDEX_LENGTH);
        const { head: index } = _;
        const { res: scriptLength, length: scriptLengthVarintLength } = varint_1.decodeVarInt(_.tail);
        _ = splitList(_.tail, scriptLengthVarintLength);
        _ = splitList(_.tail, scriptLength);
        const { head: script } = _;
        _ = splitList(_.tail, SEQ_LENGTH);
        const { head: seq } = _;
        inputs.push({
            tx,
            index,
            script,
            seq
        });
    }
    return {
        version,
        inputs,
        tail: _.tail
    };
};
/**
 * encodes a {@link TXObj} into a number[] compatible with a Buffer
 *
 * @param {TXObj} txObj
 * @returns
 */
exports.formatTx = (txObj) => {
    const { version, inputs, tail } = txObj;
    const flattenedInputs = inputs.reduce((acc, input) => {
        const { tx, index, script, seq } = input;
        const { res: varintScriptLength } = varint_1.encodeVarint(script.length);
        const flInput = tx.concat(index).concat(varintScriptLength).concat(script).concat(seq);
        return acc.concat(flInput);
    }, []);
    const { res: varintNumberOfInputs } = varint_1.encodeVarint(inputs.length);
    const result = version.concat(varintNumberOfInputs).concat(flattenedInputs).concat(tail);
    return result;
};
//# sourceMappingURL=parse.js.map