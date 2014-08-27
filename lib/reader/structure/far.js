define(['../primitives'], function (primitives) {

    return {
        isLocal : function (datum) {
            return (datum.segment[datum.position-8] & 0x03) !== 2;
        },
        isSingle : function (datum) {
            return !(datum.segment[datum.position] & 0x04);
        },
        tag : function (arena, datum) {
            var offset = primitives.uint32(datum.segment, datum.position) & 0xfffffff8;

            return {
                segment : arena.getSegment(primitives.uint32(datum.segment, datum.position+4)),
                position : datum.segment[datum.position] & 0x04 ? offset + 16 : offset + 8
            };
        },
        start : function (tag) {
            // Two word landing pad predicate.
            var segment = datum.segment;
            var position = datum.position;
            var half = primitives.int32(segment, position-16) & 0xfffffffc;

            return {
                segment : arena.getSegment(primitives.uint32(segment, position-12)),
                position : primitives.uint32(segment, position-16) & 0xfffffff8;
            };
        }
    };
});
