define(['../../reader/isNull', '../fields'], function (
                      isNull,      fields) {

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
        var disownReader = fields.pointer.disownReader(List._READER);

        List._disownField = function (offset) {
            return function () {
                var pointer = {
                    segment : this._segment,
                    position : this._pointersSection + offset
                };

                if (isNull(pointer))
                    throw new ValueError('Cannot disown a null list pointer');

                return disown(this, offset);
            };
        };

        List._unionDisownField = function (discr, offset) {
            return function () {
                fields.throwOnInactive(this.which(), discr);

                var pointer = {
                    segment : this._segment,
                    position : this._pointersSection + offset
                };

                if (isNull(pointer))
                    throw new ValueError('Cannot disown a null list pointer');

                return disown(this, offset);
            };
        };

        List._disownReaderField = function (offset) {
            return function () {
                var pointer = {
                    segment : this._segment,
                    position : this._pointersSection + offset
                };

                if (isNull(pointer))
                    throw new ValueError('Cannot disown a null list pointer');

                return disownReader(this, offset);
            };
        };

        List._unionDisownReaderField = function (discr, offset) {
            return function () {
                fields.throwOnInactive(this.which(), discr);

                var pointer = {
                    segment : this._segment,
                    position : this._pointersSection + offset
                };

                if (isNull(pointer))
                    throw new ValueError('Cannot disown a null list pointer');

                return disownReader(this, offset);
            };
        };
    };
});
