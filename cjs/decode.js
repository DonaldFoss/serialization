var primitives = require('./decode/primitives');
var fields = require('./decode/fields');
var structure = require('./decode/structure');
var lists = require('./decode/lists');
var AnyPointer = require('./decode/AnyPointer');
var isNull = require('./decode/isNull');
    module.exports = {
        isNull: isNull,
        primitives: primitives,
        fields: fields,
        structure: structure,
        lists: lists,
        AnyPointer: AnyPointer
    };
