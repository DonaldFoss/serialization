
    module.exports = function(List) {
        return function(arena, length) {
            var size = length * (List._CT.dataBytes + List._CT.pointersBytes);
            var blob = arena._allocate(size);
            arena._zero(blob, size);
            return new List(arena, {
                segment: blob.segment,
                begin: blob.position,
                length: length,
                dataBytes: List._CT.dataBytes,
                pointersBytes: List._CT.pointersBytes
            }, true);
        };
    };
