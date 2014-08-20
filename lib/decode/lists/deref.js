define([], function () {

    return function (List, layout) {
        return function (segments, segment, position) {
            if (segment[position+7] & 0x03 === 1) {
                return new List(layout.intrasegment(segments, segment, position));
            } else if (segment[position+7] & 0x03 === 2) {
                return new List(layout.intersegment(segments, segment, position));
            } else if (segment[position] === 0
                     & segment[position+1] === 0
                     & segment[position+2] === 0
                     & segment[position+3] === 0
                     & segment[position+4] === 0
                     & segment[position+5] === 0
                     & segment[position+6] === 0
                     & segment[position+7] === 0) {

                throw new Error('Null pointer');
            } else {
                throw new Error('Expected a List pointer');
            }
        };
    };
});
