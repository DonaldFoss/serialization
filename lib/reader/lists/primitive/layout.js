define(['../../primitives'], function (
               primitives) {

    var sizes = [0, null, 1, 2, 4, 8, 8];

    /*
     * Compute a list's cardinality.
     *
     * * segment Data - Bytes that contain the list's pointer.
     * * position UInt32 - Offset from the start of `segment` to the list's
     * * pointer.
     */
    var cardinality = function (segment, position) {
        return primitives.uint32(segment, position+4) >>> 3;
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
    var doubleFarLayout = function (segment, position) {
        return {
            begin : primitives.uint32(segment, position) & 0xfffffff8,
            length : cardinality(segment, position+8),
            dataBytes : sizes[segment[position+12] & 0x07]
        };
    };

    /*
     * Compute the layout of an INTRAsegment, list pointer's target.
     *
     * * segment Data - Bytes containing a pointer and its target list.
     * * position UInt32 - Position of the pointer within `segment`.
     */
    var intrasegment = function (segment, position) {
        var half = primitives.int32(segment, position) & 0xfffffffc;
        var start = position + 8 + half + half;

        return {
            segment : segment,
            begin : start,
            length : cardinality(segment, position),
            dataBytes : sizes[segment[position+4] & 0x07]
        };
    };

    var intersegment = function (arena, segment, position) {
        var nextSegment = arena.getSegment(primitives.uint32(segment, position+4));
        var nextPosition = primitives.uint32(segment, position) & 0xfffffff8;

        var layout;
        if (segment[position] & 0x04) {
            // Double hop
            layout = doubleFarLayout(nextSegment, nextPosition);
            layout.segment = arena.getSegment(primitives.uint32(nextSegment, nextPosition+4));
        } else {
            // Single hop
            layout = intrasegment(nextSegment, nextPosition);
        }

        return layout;
    };

    return {
        cardinality : cardinality,
        intrasegment : intrasegment,
        intersegment : intersegment
    };
});
