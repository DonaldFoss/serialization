define(['./deref', './methods'], function (deref, m) {

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
            this._length = list.length;
            this._dataBytes = list.dataBytes;
            this._pointersBytes = list.pointersBytes;

            this._first = this._begin + this._dataBytes;
            this._stride = this._dataBytes + this._pointersBytes;

            arena.limiter.read(list.segment, list.begin, list.length << 3);
        };

        Pointers.prototype.get = function (index) {
            if (index < 0 || this._length <= index) {
                throw new RangeError();
            }

            return Nonstruct.deref(
                this._arena, {
                    segment : this._segment,
                    position : this._first + index*this._stride
                },
                this._depth + 1
            );
        };

        Pointers.prototype.length = function () { return this._length; };

        Pointers.prototype.map = m.map;
        Pointers.prototype.forEach = m.forEach;
        Pointers.prototype.reduce = m.reduce;
        Pointers.prototype._rt = m.rt;
        Pointers.prototype._layout = m.layout;

        Pointers.deref = deref(Pointers);
    };
});
