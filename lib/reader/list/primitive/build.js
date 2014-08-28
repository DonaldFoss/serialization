define(['../../primitives', './layout', '../deref', '../methods'], function (
               primitives,     layout,      deref,      m) {

    return function (decoder) {
        var Primitives = function (arena, depth, list) {
            this._arena = arena;
            this._depth = depth;

            this._segment = list.segment;
            this._begin = list.begin;
            this._stride = list.dataBytes;
            this._length = list.length;

            arena.limiter.read(
                list.segment,
                list.begin,
                list.dataBytes * list.length
            );
        };

        Primitives.prototype.get = function (index) {
            if (index < 0 || this._length <= index) {
                throw new RangeError();
            }

            return decoder(this._segment, this._begin + this._stride * index);
        };

        Primitives.prototype.length = function () { return this._length; };

        Primitives.prototype.map = m.map;
        Primitives.prototype.forEach = m.forEach;
        Primitives.prototype.reduce = m.reduce;

        Primitives.deref = deref(Primitives, layout);

        return Primitives;
    };
});
