define([ "../primitives/layout" ], function(layout) {
    /*
     * Lists of dereferencable stuff, excluding structures.  E.g. Text, Data,
     * List(X), AnyPointer.
     */
    return function(Nonstruct) {
        var Pointers = function(list) {
            this.segments = list.segments;
            this.segment = list.segment;
            this.begin = list.begin;
            this.length = list.length;
        };
        Pointers.prototype.get = function(index) {
            if (index < 0 || this.length <= index) {
                throw new RangeError();
            }
            return Nonstruct.deref(this.segments, this.segment, this.begin + 8 * index);
        };
        Pointers.deref = function(segments, segment, position) {
            if (segment[position + 7] & 3 === 1) {
                return new Pointers(layout.intrasegment(segments, segment, position));
            } else if (segment[position + 7] & 3 === 2) {
                return new Pointers(layout.intersegment(segments, segment, position));
            } else {
                throw new Error("Expected a List pointer");
            }
        };
    };
});