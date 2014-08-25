define([ "../primitive/layout", "../methods" ], function(layout, m) {
    /*
     * Lists of dereferencable stuff, excluding structures.  E.g. Text, Data,
     * List(X), AnyPointer.
     */
    return function(Nonstruct) {
        var Pointers = function(arena, depth, list) {
            this._arena = arena;
            this._depth = depth;
            this._segment = list.segment;
            this._begin = list.begin;
            this._length = list.length;
            arena.limiter.read(list.length << 3);
        };
        Pointers.prototype.get = function(index) {
            if (index < 0 || this._length <= index) {
                throw new RangeError();
            }
            return Nonstruct.deref(this._arena, this._depth + 1, this._segment, this._begin + 8 * index);
        };
        Pointers.prototype.length = function() {
            return this._length;
        };
        Pointers.prototype.map = m.map;
        Pointers.prototype.forEach = m.forEach;
        Pointers.prototype.reduce = m.reduce;
        Pointers.deref = function(arena, depth, segment, position) {
            if ((segment[position] & 3) === 1) {
                return new Pointers(arena, depth, layout.intrasegment(segment, position));
            } else if ((segment[position] & 3) === 2) {
                return new Pointers(arena, depth, layout.intersegment(arena, segment, position));
            } else {
                throw new Error("Expected a List pointer");
            }
        };
    };
});