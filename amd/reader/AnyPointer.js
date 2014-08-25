define([], function() {
    var Any = function(arena, depth, any) {
        this._arena = arena;
        this._depth = depth;
        this._segment = any.segment;
        this._position = any.position;
    };
    Any.prototype.cast = function(Derefable) {
        return Derefable.deref(this._arena, this._depth, this._segment, this._position);
    };
    Any.deref = function(arena, depth, segment, position) {
        return new Any(arena, depth, {
            segment: segment,
            position: position
        });
    };
    return Any;
});