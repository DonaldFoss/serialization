define(['./deref', './methods'], function (
           deref,     m) {

    return function (Reader) {
        var Structs = function (arena, depth, list) {
            if (depth > arena.maxDepth) {
                throw new Error('Exceeded nesting depth limit');
            }

            if (list.dataBytes === null) {
                throw new Error('Single bit structures are not supported');
            }

            this._arena = arena;
            this._depth = depth;

            this._segment = list.segment;
            this._begin = list.begin;
            this._length = list.length;
            this._dataBytes = list.dataBytes;
            this._pointersBytes = list.pointersBytes;

            this._stride = list.dataBytes + list.pointersBytes;

            arena.limiter.read(
                list.segment,
                list.begin,
                this._stride * list.length
            );
        };

        Structs.prototype.get = function (index) {
            if (index < 0 || this._length <= index) {
                throw new RangeError();
            }

            var position = this._begin + this._stride*index;
            var pointers = position + this._dataBytes;

            /*
             * Do not apply the struct's memory to the traversal limit a second
             * time.
             */
            this._arena.limiter.unread(this._stride);

            return new Reader(this._arena, this._depth + 1, {
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
        Structs.prototype._rt = m.rt;
        Structs.prototype._layout = m.layout;

        Structs.deref = deref(Structs);

        return Structs;
    };
});
