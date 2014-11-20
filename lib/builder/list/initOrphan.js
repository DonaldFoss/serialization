define([], function () {

    return function (List) {
        return function (arena, length) {
            var size = length * (List._CT.dataBytes + List._CT.pointersBytes);
            var blob = arena._allocate(size);

            // @if TARGET_ENV='node'
            arena._zero(blob, size);
            // @endif

            return new List(
                arena,
                true,
                {
                    segment : blob.segment,
                    begin : blob.position,
                    length : length,
                    dataBytes : List._CT.dataBytes,
                    pointersBytes : List._CT.pointersBytes
                }
            );
        };
    };
});
