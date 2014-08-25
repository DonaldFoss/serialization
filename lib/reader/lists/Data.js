define(['./primitive/layout', './deref'], function (
                     layout,     deref) {

    var Data = function (arena, depth, list) {
        this._arena = arena;
        this._depth = depth;

        this._segment = list.segment;
        this._begin = list.begin;
        this._length = list.length;
    };

    Data.prototype.get = function (index) {
        if (index < 0 || this._length <= index) {
            throw new RangeError();
        }

        return this._segment[this._begin + index];
    };

    Data.prototype.raw = function () {
        return this._segment.subarray(this._begin, this._begin+this._length);
    };

    Data.prototype._size = function () {
        return this._length;
    };

    Data.deref = deref(Data, layout);

    return Data;
});
