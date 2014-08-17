define(['../../primitives', '../primitives/layout'], function (
               primitives,                 layout) {

    var sizes = [{
        data : 0,
        pointers : 0
    }, {
        data : null,
        pointers : null
    }, {
        data : 1,
        pointers : 0
    }, {
        data : 2,
        pointers : 0
    }, {
        data : 4,
        pointers : 0
    }, {
        data : 8,
        pointers : 0
    }, {
        data : 0,
        pointers : 8
    }];

    /*
     * Compute the layout of a composite whose list has `tag` within `segment`.
     */
    var inlineLayout = function (segment, tag) {
        var data = primitives.uint16(segment, tag+2) << 3;
        var pointers = primitives.uint16(segment, tag) << 3;

        return {
            begin : tag + 8,
            length : primitives.uint32(segment, tag+4) >>> 2,
            dataBytes : data,
            pointersBytes : pointers
        };
    };

    /*
     * Compute the layout of a non-composite starting at `begin` and with
     * `length` members.
     */
    var subwordLayout = function (start, size, length) {
        return {
            begin : start,
            length : length,
            dataBytes : size.data,
            pointersBytes : size.pointers
        };
    };

    /*
     * Compute the layout of an INTRAsegment, list pointer's target.
     *
     * * segment Data - Bytes containing a pointer and its target list.
     * * position UInt32 - Position of the pointer within `segment`.
     */
    var localLayout = function (segment, position) {
        var half = primitives.int32(segment, position+4) & 0xfffffffc;
        var start = position + 8 + half + half;
        var c = segment[position+3] & 0x07;

        switch (c) {
        case 1:
            throw new Error('Single-bit structure packing is unsupported');

        case 7:
            return inlineLayout(segment, start);

        default:
            return subwordLayout(
                start,
                sizes[c],
                layout.cardinality(segment, position)
            );
        }
    };

    /*
     * Compute the layout of a list from the first hop of a double-far
     * INTERsegment pointer.
     *
     * * segment Data - Bytes containing the target of an intersegment pointer's
     *   first hop.
     * * position UInt32 - Position of the intersegment pointer within
     *   `segment`.
     * * targetSegment Data - The final hop's data.
     */
    var doubleFarLayout = function (segment, position, targetSegment) {
        var start = primitives.uint32(segment, position+4) & 0xfffffff8;
        var c = segment[position+11] & 0x07;

        switch (c) {
        case 1:
            throw new Error('Single-bit structure packing is unsupported');

        case 7:
            return inlineLayout(targetSegment, start);

        default:
            return subwordLayout(
                start,
                sizes[c],
                layout.cardinality(segment, position+8)
            );
        }
    };

    var intrasegment = function (segments, segment, position) {
        var layout = localLayout(segment, position);

        layout.segments = segments;
        layout.segment = segment;

        return layout;
    };

    var intersegment = function (segments, segment, position) {
        var nextSegment = segments[primitives.uint32(segment, position)];
        var nextPosition = primitives.uint32(segment, position+4) & 0xfffffff8;

        if (segment[position+7] & 0x04) {
            // Double hop
            segment = segments[primitives.uint32(nextSegment, nextPosition)];
            position = primitives.uint32(nextSegment, nextPosition+4) & 0xfffffff8;

            var layout = doubleFarLayout(nextSegment, nextPosition, segment);

            layout.segments = segments;
            layout.segment = segment;

            return layout;
        } else {
            // Single hop
            return intraSegment(segments, nextSegment, nextPosition);
        }
    };

    return {
        intrasegment : intrasegment,
        intersegment : intersegment
    };
});
