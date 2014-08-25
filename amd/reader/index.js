define([ "./primitives", "./fields", "./structure", "./lists", "./AnyPointer", "./isNull" ], function(primitives, fields, structure, lists, AnyPointer, isNull) {
    return {
        isNull: isNull,
        primitives: primitives,
        fields: fields,
        structure: structure,
        lists: lists,
        AnyPointer: AnyPointer
    };
});