define(['../layout', '../methods'], function (layout, m) {

    /*
     * Lists of dereferencable stuff, excluding structures.  E.g. Text, Data,
     * List(X), AnyPointer.
     */
    return function (Nonstruct) { 
        var Pointers = function (arena, depth, list) {
            if (depth > arena.maxDepth) {
                throw new Error('Exceeded nesting depth limit');
            }

            this._arena = arena;
            this._depth = depth;

            this._segment = list.segment;
            this._begin = list.begin;
            this._dataBytes = list.dataBytes;
            this._pointersBytes = list.pointersBytes;
            this._length = list.length;

            arena.limiter.read(list.segment, list.begin, list.length << 3);
        };

        Pointers.prototype.get = function (index) {
            if (index < 0 || this._length <= index) {
                throw new RangeError();
            }

            return Nonstruct.deref(
                this._arena, {
                    segment : this._segment,
                    position : this._begin + 8*index
                },
                this._depth + 1
            );
        };

        Pointers.prototype.length = function () { return this._length; };

        Pointers.prototype.map = m.map;
        Pointers.prototype.forEach = m.forEach;
        Pointers.prototype.reduce = m.reduce;

        Pointers.deref = function (arena, datum, depth) {
            var typeBits = datum.segment[datum.position] & 0x03;

            if (typeBits === 1) {
                return new Pointers(arena, depth, layout.intrasegment(datum));
            } else if (typeBits === 2) {
                return new Pointers(arena, depth, layout.intersegment(arena, datum));
            } else {
                throw new Error('Expected a List pointer');
            }
        };
    };
});
