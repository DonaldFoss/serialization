define([ "../../primitives" ], function(primitives) {
    var sizes = [ 0, null, 1, 2, 4, 8, 8 ];
    /*
     * Compute a list's cardinality.
     *
     * * segment Data - Bytes that contain the list's pointer.
     * * position UInt32 - Offset from the start of `segment` to the list's
     * * pointer.
     */
    var cardinality = function(segment, position) {
        return primitives.uint32(segment, position + 4) >>> 3;
    };
    /*
     * Compute the layout of an INTRAsegment, list pointer's target.
     *
     * * segment Data - Bytes containing a pointer and its target list.
     * * position UInt32 - Position of the pointer within `segment`.
     */
    var localLayout = function(segment, position) {
        var half = primitives.int32(segment, position) & 4294967292;
        var start = position + 8 + half + half;
        return {
            begin: start,
            length: cardinality(segment, position),
            dataBytes: sizes[segment[position + 4] & 7]
        };
    };
    /*
     * Compute the layout of a list from the first hop of a double-far
     * INTERsegment pointer.
     *
     * * segment Data - Bytes containing the target of an intersegment pointer's
     *   first hop.
     * * position UInt32 - Position of the intersegment pointer within
     *   `segment`.
     */
    var doubleFarLayout = function(segment, position) {
        return {
            begin: primitives.uint32(segment, position) & 4294967288,
            length: cardinality(segment, position + 8),
            dataBytes: sizes[segment[position + 12] & 7]
        };
    };
    var intrasegment = function(segments, segment, position) {
        var layout = localLayout(segment, position);
        layout.segments = segments;
        layout.segment = segment;
        return layout;
    };
    var intersegment = function(segments, segment, position) {
        var nextSegment = segments[primitives.uint32(segment, position + 4)];
        var nextPosition = primitives.uint32(segment, position) & 4294967288;
        if (segment[position] & 4) {
            // Double hop
            var layout = doubleFarLayout(nextSegment, nextPosition);
            layout.segments = segments;
            layout.segment = segments[primitives.uint32(nextSegment, nextPosition + 4)];
            return layout;
        } else {
            // Single hop
            return intrasegment(segments, nextSegment, nextPosition);
        }
    };
    return {
        cardinality: cardinality,
        intrasegment: intrasegment,
        intersegment: intersegment
    };
});