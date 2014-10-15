var copy = require('../copy/deep');
var list = require('../layout/list');
    module.exports = function(arena, pointer, value) {
        copy.setListPointer(value._arena, value._layout(), arena, pointer);
    };
