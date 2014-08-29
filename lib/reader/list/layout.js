define(['../primitives'], function (primitives) {

    var sizes = [{
        dataBytes : 0,
        pointersBytes : 0
    }, {
        dataBytes : null,
        pointersBytes : null
    }, {
        dataBytes : 1,
        pointersBytes : 0
    }, {
        dataBytes : 2,
        pointersBytes : 0
    }, {
        dataBytes : 4,
        pointersBytes : 0
    }, {
        dataBytes : 8,
        pointersBytes : 0
    }, {
        dataBytes : 0,
        pointersBytes : 8
    }];

    /*
     * Compute a list's cardinality.
     */
    var cardinality = function (datum) {
        return primitives.uint32(datum.segment, datum.position+4) >>> 3;
    };

    /*
     * Compute the layout of a list from the first hop of a double-far
     * INTERsegment pointer.
     */
    var doubleFarLayout = function (datum) {
        if (datum.segment[datum.position] === undefined
         || datum.segment[datum.position + 8] === undefined) {
            throw new RangeError();
        }
        var size = sizes[datum.segment[datum.position+12] & 0x07];

        return {
            begin : primitives.uint32(datum.segment, datum.position) & 0xfffffff8,
            length : cardinality(datum.segment, datum.position+8),
            dataBytes : size.dataBytes,
            pointersBytes : size.pointersBytes
        };
    };

    /*
     * Compute the layout of an INTRAsegment, list pointer's target.
     */
    var intrasegment = function (datum) {
        if (datum.segment[datum.position] === undefined) {
            throw new RangeError();
        }

        var half = primitives.int32(datum.segment, datum.position) & 0xfffffffc;
        var start = datum.position + 8 + half + half;
        var size = sizes[datum.segment[datum.position+4] & 0x07];

        return {
            segment : datum.segment,
            begin : start,
            length : cardinality(datum),
            dataBytes : size.dataBytes,
            pointersBytes : size.pointersBytes
        };
    };

    /*
     * Compute the layout of an INTERsegment, list pointer's target.
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
        cardinality : cardinality,
        intrasegment : intrasegment,
        intersegment : intersegment,
    };
});
