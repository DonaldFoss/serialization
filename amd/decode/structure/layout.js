define([ "../primitives" ], function(primitives) {
    /*
     * Compute the layout of an INTRAsegment, struct pointer's target.
     *
     * * segment Data - Bytes containing a pointer and its target struct.
     * * position UInt32 - Position of the pointer within `segment`.
     */
    var localLayout = function(segment, position) {
        var half = primitives.int32(segment, position) & 4294967292;
        var data = position + 8 + half + half;
        var pointers = data + (primitives.uint16(segment, position + 4) << 3);
        return {
            dataSection: data,
            pointersSection: pointers,
            end: pointers + (primitives.uint16(segment, position + 6) << 3)
        };
    };
    /*
     * Compute the layout of a struct from the first hop of a double-far
     * INTERsegment pointer.
     *
     * * segment Data - Bytes containing the target of an intersegment pointer's
     *   first hop.
     * * position UInt32 - Position of the intersegment pointer within
     *   `segment`.
     */
    var doubleFarLayout = function(segment, position) {
        var dataSection = primitives.uint32(segment, position) & 4294967288;
        var pointers = dataSection + (primitives.uint16(segment, position + 12) << 3);
        return {
            dataSection: dataSection,
            pointersSection: pointers,
            end: pointers + (primitives.uint16(segment, position + 14) << 3)
        };
    };
    /*
     * Create structure data for the INTRAsegment pointer located at `position`
     * within `segment`.
     */
    var intrasegment = function(segments, segment, position) {
        var layout = localLayout(segment, position);
        layout.segments = segments;
        layout.segment = segment;
        return layout;
    };
    /*
     * Create structure data for the INTERsegment pointer located at `position`
     * within `segment`.
     */
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
        intrasegment: intrasegment,
        intersegment: intersegment
    };
});