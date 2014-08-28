define(['../../primitives', '../primitive/layout'], function (
               primitives,                layout) {

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
    var inlineLayout = function (tag) {
        if (tag.segment[tag.position] === undefined) {
            throw new RangeError();
        }

        var data = primitives.uint16(tag.segment, tag.position+4) << 3;
        var pointers = primitives.uint16(tag.segment, tag.position+6) << 3;

        return {
            begin : tag.position + 8,
            length : primitives.uint32(tag.segment, tag.position) >>> 2,
            dataBytes : data,
            pointersBytes : pointers
        };
    };

    /*
     * Compute the layout of a non-composite starting at `start` and with
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
     */
    var localLayout = function (datum) {
        var half = primitives.int32(datum.segment, datum.position) & 0xfffffffc;
        var start = datum.position + 8 + half + half;
        var c = datum.segment[datum.position+4] & 0x07;

        switch (c) {
        case 1:
            throw new Error('Single-bit structure packing is unsupported');

        case 7:
            return inlineLayout(datum.segment, start);

        default:
            return subwordLayout(
                start,
                sizes[c],
                layout.cardinality(datum)
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
    var doubleFarLayout = function (datum, targetSegment) {
        if (datum.segment[datum.position] === undefined
         || datum.segment[datum.position + 8] === undefined) {
            throw new RangeError();
        }

        var start = primitives.uint32(datum.segment, datum.position) & 0xfffffff8;
        var c = datum.segment[datum.position+12] & 0x07;

        switch (c) {
        case 1:
            throw new Error('Single-bit structure packing is unsupported');

        case 7:
            return inlineLayout({
                segment : targetSegment,
                position : start
            });

        default:
            return subwordLayout(
                start,
                sizes[c],
                layout.cardinality({
                    segment : datum.segment,
                    position : datum.position+8
                })
            );
        }
    };

    var intrasegment = function (datum) {
        if (datum.segment[datum.position] === undefined) {
            throw new RangeError();
        }

        var layout = localLayout(datum);
        layout.segment = segment;

        return layout;
    };

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
            var segment = arena.getSegment(primitives.uint32(nextDatum.segment, nextDatum.position+4));
            layout = doubleFarLayout(nextDatum, segment);
            layout.segment = segment;
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
