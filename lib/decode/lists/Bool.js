define(['../primitives', './primitive/layout', './deref', './methods'], function (
            primitives,               layout,     deref,     m) {

    var Bools = function (list) {
        this._segments = list.segments;
        this._segment = list.segment;
        this._begin = list.begin;
        this._length = list.length;
    };

    Bools.prototype.get = function (index) {
        if (index < 0 || this._length <= index) {
            throw new RangeError();
        }

        return primitives.bool(this._segment, this._begin + (index >>> 3), index & 0x07);
    };

    Bools.prototype.length = function () { return this._length; };

    Bool.prototype.map = m.map;
    Bool.prototype.forEach = m.forEach;
    Bool.prototype.reduce = m.reduce;

    Bools.deref = deref(Bools, layout);

    return Bools;
});
