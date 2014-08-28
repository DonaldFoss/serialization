define(['../primitives'], function (primitives) {

    /*
     * Compute the layout of a struct from the first hop of a double-far
     * INTERsegment pointer.
     */
    var doubleFarLayout = function (datum) {
        if (datum.segment[datum.position] === undefined || datum.segment[datum.position + 8] === undefined) {
            throw new RangeError();
        }

        var dataSection = primitives.uint32(datum.segment, datum.position) & 0xfffffff8;
        var pointers = dataSection + (primitives.uint16(datum.segment, datum.position+12) << 3);

        return {
            dataSection : dataSection,
            pointersSection : pointers,
            end : pointers + (primitives.uint16(datum.segment, datum.position+14) << 3)
        };
    };

    /*
     * Compute the layout of an INTRAsegment, struct pointer's target.
     *
     * * segment Data - Bytes containing a pointer and its target struct.
     * * position UInt32 - Position of the pointer within `segment`.
     */
    var intrasegment = function (datum) {
        if (datum.segment[datum.position] === undefined) {
            throw new RangeError();
        }

        var half = primitives.int32(datum.segment, datum.position) & 0xfffffffc;
        var data = datum.position + 8 + half + half;
        var pointers = data + (primitives.uint16(datum.segment, datum.position+4) << 3);

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
    var intersegment = function (arena, datum) {
        if (datum.segment[datum.position] === undefined) {
            throw new RangeError();
        }

        var nextDatum = {
            segment : arena.getSegment(primitives.uint32(datum.segment, datum.position+4)),
            position : primitives.uint32(datum.segment, datum.position) & 0xfffffff8
        };

        var layout;
        if (datum.segment[datum.position] & 0x04) {
            // Double hop
            layout = doubleFarLayout(nextDatum);
            layout.segment = arena.getSegment(primitives.uint32(nextDatum.segment, nextDatum.position+4));
        } else {
            // Single hop
            layout = intrasegment(nextDatum);
        }

        return layout;
    };

    return {
        intrasegment : intrasegment,
        intersegment : intersegment
    };
});
