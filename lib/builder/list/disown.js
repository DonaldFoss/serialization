define(['../fields'], function (fields) {

    return function (List) {
        List._initOrphan = function (arena, length) {
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

        var disown = fields.pointer.disown(List);
        var disownReader = fields.pointer.disownReader(List);

        List._disownField = function (offset) {
            return function () {
                return disown(this, offset);
            };
        };

        List._unionDisownField = function (discr, offset) {
            return function () {
                fields.throwOnInactive(this.which(), discr);
                return disown(this, offset);
            };
        };

        List._disownReaderField = function (offset) {
            return function () {
                return disownReader(this, offset);
            };
        };

        List._unionDisownReaderField = function (discr, offset) {
            return function () {
                fields.throwOnInactive(this.which(), discr);
                return disownReader(this, offset);
            };
        };
    };
});
