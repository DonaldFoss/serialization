define([ "../primitives", "./primitive", "./structure", "./pointer", "./types" ], function(decode, primitive, structure, pointer, types) {
    return {
        structure: structure,
        pointer: pointer,
        Text: types.Text,
        Data: types.Data,
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
        Float64: primitive(decode.float64)
    };
});