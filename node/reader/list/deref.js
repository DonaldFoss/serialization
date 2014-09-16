var layout = require('../layout/list');
    module.exports = function(List) {
        return function(arena, pointer, depth) {
            return new List(arena, depth, layout.safe(arena, pointer));
        };
    };
