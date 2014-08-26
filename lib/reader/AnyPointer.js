define([], function () {

    var Any = function (arena, depth, any) {
        this._arena = arena;
        this._depth = depth;

        this._segment = any.segment;
        this._position = any.position;

        /* Traversal and nesting limits applied by other pointer types. */
    };

    Any.prototype.cast = function (Derefable) {
        /*
         * No increment on `depth` since the caller of `deref` has already
         * incremented.
         */
        return Derefable.deref(this._arena, this._depth, this._segment, this._position);
    };

    Any.deref = function (arena, depth, segment, position) {
        return new Any(arena, depth, {
            segment : segment,
            position : position
        });
    };

    return Any;
});
