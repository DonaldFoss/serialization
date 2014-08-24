
    var Any = function(any) {
        this._segments = any.segments;
        this._segment = any.segment;
        this._position = any.position;
    };
    Any.prototype.cast = function(derefable) {
        return derefable.deref(this._segments, this._segment, this._position);
    };
    Any.deref = function(segments, segment, position) {
        return new Any({
            segments: segments,
            segment: segment,
            position: position
        });
    };
    module.exports = Any;
