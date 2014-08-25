var primitives = require('./primitives');
var fields = require('./fields');
var structure = require('./structure');
var lists = require('./lists');
var AnyPointer = require('./AnyPointer');
var isNull = require('./isNull');
    module.exports = {
        isNull: isNull,
        primitives: primitives,
        fields: fields,
        structure: structure,
        lists: lists,
        AnyPointer: AnyPointer
    };
