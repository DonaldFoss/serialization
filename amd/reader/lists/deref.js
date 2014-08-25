define([ "../isNull" ], function(isNull) {
    return function(List, layout) {
        return function(arena, depth, segment, position) {
            if ((segment[position] & 3) === 1) {
                return new List(arena, depth, layout.intrasegment(segment, position));
            } else if ((segment[position] & 3) === 2) {
                return new List(arena, depth, layout.intersegment(arena, segment, position));
            } else if (isNull(segment, position)) {
                throw new Error("Dereferenced a null pointer");
            } else {
                throw new Error("Expected a List pointer");
            }
        };
    };
});