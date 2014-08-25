define(['../primitives'], function (
            primitives) {

    /*
     * Compute the layout of a struct from the first hop of a double-far
     * INTERsegment pointer.
     *
     * * segment Data - Bytes containing the target of an intersegment pointer's
     *   first hop.
     * * position UInt32 - Position of the intersegment pointer within
     *   `segment`.
     */
    var doubleFarLayout = function (segment, position) {
        var dataSection = primitives.uint32(segment, position) & 0xfffffff8;
        var pointers = dataSection + (primitives.uint16(segment, position+12) << 3);

        return {
            dataSection : dataSection,
            pointersSection : pointers,
            end : pointers + (primitives.uint16(segment, position+14) << 3)
        };
    };

    /*
     * Compute the layout of an INTRAsegment, struct pointer's target.
     *
     * * segment Data - Bytes containing a pointer and its target struct.
     * * position UInt32 - Position of the pointer within `segment`.
     */
    var intrasegment = function (segment, position) {
        var half = primitives.int32(segment, position) & 0xfffffffc;
        var data = position + 8 + half + half;
        var pointers = data + (primitives.uint16(segment, position+4) << 3);

        return {
            segment : segment,
            dataSection : data,
            pointersSection : pointers,
            end : pointers + (primitives.uint16(segment, position+6) << 3)
        };
    };

    /*
     * Create structure data for the INTERsegment pointer located at `position`
     * within `segment`.
     */
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
        intrasegment : intrasegment,
        intersegment : intersegment
    };
});
