define(['../isNull'], function (isNull) {

    return function (List, layout) {
        return function (segments, segment, position) {
            if (segment[position] & 0x03 === 1) {
                return new List(layout.intrasegment(segments, segment, position));
            } else if (segment[position] & 0x03 === 2) {
                return new List(layout.intersegment(segments, segment, position));
            } else if (isNull(segment, position)) {

                throw new Error('Dereferenced a null pointer');
            } else {
                throw new Error('Expected a List pointer');
            }
        };
    };
});
