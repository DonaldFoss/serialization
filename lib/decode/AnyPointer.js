define([], function () {

    var Any = function (any) {
        this.segments = any.segments;
        this.segment = any.segment;
        this.position = position;
    };

    Any.prototype.cast = function (derefable) {
        return derefable.deref(this.segments, this.segment, this.position);
    };

    Any.deref = function (segments, segment, position) {
        return new Any({
            segments : segments,
            segment : segment,
            position : position
        });
    };

    return Any;
});
