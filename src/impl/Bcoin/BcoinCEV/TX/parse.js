"use strict";
exports.__esModule = true;
var hex_1 = require("./../../utils/hex");
var varint_1 = require("./varint");
var VERSION_LENGTH = 4;
var TX_HASH_LENGTH = 32;
var INPUT_INDEX_LENGTH = 4;
var SEQ_LENGTH = 4;
var splitList = function (list, at) { return ({
    head: list.slice(0, at),
    tail: list.slice(at)
}); };
/**
 * parses a raw Hex string or a number[] representing a BC transacton into a {@link TXObj}
 *
 * @param {(number[] | string)} raw
 * @returns {TXObj}
 */
exports.parseTx = function (raw) {
    if ('string' === typeof raw) {
        raw = hex_1.rawHexStringToIntArray(raw);
    }
    var _ = splitList(raw, 0);
    _ = splitList(_.tail, VERSION_LENGTH);
    var version = _.head;
    var _a = varint_1.decodeVarInt(_.tail), nInputs = _a.res, nInputsVarintLength = _a.length;
    _ = splitList(_.tail, nInputsVarintLength);
    var inputs = [];
    for (var i = 0; i < nInputs; i++) {
        _ = splitList(_.tail, TX_HASH_LENGTH);
        var tx = _.head;
        _ = splitList(_.tail, INPUT_INDEX_LENGTH);
        var index = _.head;
        var _b = varint_1.decodeVarInt(_.tail), scriptLength = _b.res, scriptLengthVarintLength = _b.length;
        _ = splitList(_.tail, scriptLengthVarintLength);
        _ = splitList(_.tail, scriptLength);
        var script = _.head;
        _ = splitList(_.tail, SEQ_LENGTH);
        var seq = _.head;
        inputs.push({
            tx: tx,
            index: index,
            script: script,
            seq: seq
        });
    }
    return {
        version: version,
        inputs: inputs,
        tail: _.tail
    };
};
/**
 * encodes a {@link TXObj} into a number[] compatible with a Buffer
 *
 * @param {TXObj} txObj
 * @returns
 */
exports.formatTx = function (txObj) {
    var version = txObj.version, inputs = txObj.inputs, tail = txObj.tail;
    var flattenedInputs = inputs.reduce(function (acc, input) {
        var tx = input.tx, index = input.index, script = input.script, seq = input.seq;
        var varintScriptLength = varint_1.encodeVarint(script.length).res;
        var flInput = tx.concat(index).concat(varintScriptLength).concat(script).concat(seq);
        return acc.concat(flInput);
    }, []);
    var varintNumberOfInputs = varint_1.encodeVarint(inputs.length).res;
    var result = version.concat(varintNumberOfInputs).concat(flattenedInputs).concat(tail);
    return result;
};
