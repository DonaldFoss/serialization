define(['./layout', '../deref', '../methods'], function (
           layout,      deref,      m) {

    return function (Reader) {
        var Structs = function (arena, depth, list) {
            this._arena = arena;
            this._depth = depth;

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

            return new Reader(arena, this._depth + 1, {
                segment : this._segment,
                dataSection : position,
                pointersSection : pointers,
                end : pointers + this._pointersBytes
            });
        };

        Structs.prototype.length = function () { return this._length; };

        Structs.prototype.map = m.map;
        Structs.prototype.forEach = m.forEach;
        Structs.prototype.reduce = m.reduce;

        Structs.prototype._size = function () {
            return this._length*this._stride;
        };

        Structs.deref = deref(Structs, layout);

        return Structs;
    };
});
