var primitives = require('./primitives');
    // Float conversion helpers
    var buffer = new ArrayBuffer(4);
    var view = new DataView(buffer);
    module.exports = {
        bool: function(defaultValue, bytes, position, bitPosition) {
            return primitives.bool(bytes, position, bitPosition) ^ defaultValue | 0;
        },
        int8: function(defaultValue, bytes, position) {
            return primitives.int8(bytes, position) ^ defaultValue | 0;
        },
        int16: function(defaultValue, bytes, position) {
            return primitives.int16(bytes, position) ^ defaultValue | 0;
        },
        int32: function(defaultValue, bytes, position) {
            return primitives.int32(bytes, position) ^ defaultValue | 0;
        },
        int64ish: function(defaultValue, bytes, position) {
            /*
             * On widespread (u)int64 support, add a proper `int64` and an
             * annotation for targeting `int64`.
             */
            return [ primitives.int32(bytes, position + 4) ^ defaultValue[0] | 0, (primitives.uint32(bytes, position) ^ defaultValue[1]) >>> 0 ];
        },
        uint8: function(defaultValue, bytes, position) {
            return (primitives.uint8(bytes, position) ^ defaultValue) >>> 0;
        },
        uint16: function(defaultValue, bytes, position) {
            return (primitives.uint16(bytes, position) ^ defaultValue) >>> 0;
        },
        uint32: function(defaultValue, bytes, position) {
            return (primitives.uint32(bytes, position) ^ defaultValue) >>> 0;
        },
        uint64ish: function(defaultValue, bytes, position) {
            /*
             * On widespread (u)int64 support, add a proper `uint64` and an
             * annotation for targeting `uint64`.
             */
            return [ (primitives.uint32(bytes, position + 4) ^ defaultValue[0]) >>> 0, (primitives.uint32(bytes, position) ^ defaultValue[1]) >>> 0 ];
        },
        // Float decoders use byte representation defaults instead of javascript integrals
        float32: function(defaultBytes, bytes, position) {
            var i = 3;
            do {
                buffer[i] = bytes[position + i] ^ defaultBytes[i];
            } while (--i);
            return view.getFloat32(0, true);
        },
        float64: function(defaultBytes, bytes, position) {
            var i = 7;
            do {
                buffer[i] = bytes[position + i] ^ defaultBytes[i];
            } while (--i);
            return view.getFloat64(0, true);
        }
    };
