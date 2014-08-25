var decode = require('./primitives');
var primitive = require('./lists/primitive/build');
var structure = require('./lists/structure/build');
var pointer = require('./lists/pointer/build');
var types = require('./lists/types');
    module.exports = {
        structure: structure,
        pointer: pointer,
        Void: types.Void,
        Bool: types.Bool,
        Int8: primitive(decode.int8),
        Int16: primitive(decode.int16),
        Int32: primitive(decode.int32),
        Int64: primitive(decode.int64),
        UInt8: primitive(decode.uint8),
        UInt16: primitive(decode.uint16),
        UInt32: primitive(decode.uint32),
        UInt64: primitive(decode.uint64),
        Float32: primitive(decode.float32),
        Float64: primitive(decode.float64),
        Text: types.Text,
        Data: types.Data
    };
