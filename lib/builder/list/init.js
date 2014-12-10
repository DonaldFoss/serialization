define(['../../reader/layout/list', '../layout/list', '../fields'], function (
               reader,                         list,      fields) {

    return function (List) {
        var stride = List._CT.dataBytes + List._CT.pointersBytes;

        List._init = function (arena, pointer, length) {
            var size = length * stride;
            var blob = arena._preallocate(pointer.segment, size);

            // @if TARGET_ENV='node'
            arena._zero(blob, size);
            // @endif

            list.preallocated(pointer, blob, List._CT, length);

            return new List(arena, false, reader.unsafe(arena, pointer));
        };

        var init = fields.list.init(List);

        List._initField = function (offset) {
            return function (length) {
                return init(this, offset, length);
            };
        };

        List._unionInitField = function (discr, offset) {
            return function (length) {
                this._setWhich(discr);
                return init(this, offset, length);
            };
        };
    };
});
