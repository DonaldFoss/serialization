define(['../primitives', './primitive/layout', './deref', './methods'], function (
            primitives,               layout,     deref,     m) {

    var Bools = function (arena, depth, list) {
        this._arena = arena;
        this._depth = depth;

        this._segment = list.segment;
        this._begin = list.begin;
        this._length = list.length;

        arena.limiter.read(
            list.segment,
            list.begin,
            Math.ceil(list.length / 8)
        );
    };

    Bools.prototype.get = function (index) {
        if (index < 0 || this._length <= index) {
            throw new RangeError();
        }

        return !!primitives.bool(this._segment, this._begin + (index >>> 3), index & 0x07);
    };

    Bools.prototype.length = function () { return this._length; };

    Bools.prototype.map = m.map;
    Bools.prototype.forEach = m.forEach;
    Bools.prototype.reduce = m.reduce;

    Bools.deref = deref(Bools, layout);

    return Bools;
});
