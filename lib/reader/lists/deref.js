define(['../isNull'], function (isNull) {

    return function (List, layout) {
        return function (arena, datum, depth) {
            var typeBits = datum.segment[datum.position] & 0x03;

            if (typeBits === 1) {
                return new List(arena, depth, layout.intrasegment(datum));
            } else if (typeBits === 2) {
                return new List(arena, depth, layout.intersegment(arena, datum));
            } else if (isNull(datum)) {
                throw new Error('Dereferenced a null pointer');
            } else {
                throw new Error('Expected a List pointer');
            }
        };
    };
});
