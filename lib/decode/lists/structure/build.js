define(['./layout', '../deref'], function (layout, deref) {

    return function (Reader) {
        var Structs = function (list) {
            this._segments = list.segments;
            this._segment = list.segment;
            this._begin = list.begin;
            this._stride = list.dataBytes + list.pointersBytes;
            this._length = list.length;
            this._dataBytes = list.dataBytes;
            this._pointersBytes = list.pointersBytes;
        };

        Structs.prototype.get = function (index) {
            if (index < 0 || this._length <= index) {
                throw new RangeError();
            }

            var position = this._begin + this._stride * index;
            var pointers = position + this._dataBytes;

            return new Reader({
                segments : this._segments,
                segment : this._segment,
                dataSection : position,
                pointersSection : pointers,
                end : pointers + this._pointersBytes
            });
        };

        Structs.prototype.length = function () { return this._length; };

        Structs.deref = deref(Structs, layout);

        return Structs;
    };
});
