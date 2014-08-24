var isNull = require('../isNull');
    module.exports = function(List, layout) {
        return function(segments, segment, position) {
            if ((segment[position] & 3) === 1) {
                return new List(layout.intrasegment(segments, segment, position));
            } else if ((segment[position] & 3) === 2) {
                return new List(layout.intersegment(segments, segment, position));
            } else if (isNull(segment, position)) {
                throw new Error("Dereferenced a null pointer");
            } else {
                throw new Error("Expected a List pointer");
            }
        };
    };
