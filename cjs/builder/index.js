var copy = require('./copy/index');
var zero = require('./zero');
var structure = require('./structure');
var fields = require('./fields');
var primitives = require('./primitives');
    module.exports = {
        structure: structure,
        fields: fields,
        primitives: primitives,
        copy: copy,
        zero: zero
    };
