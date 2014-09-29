var layout = require('../../reader/layout/list');
    module.exports = function(List) {
        return function(arena, pointer) {
            return new List(arena, layout.unsafe(arena, pointer), false);
        };
    };
