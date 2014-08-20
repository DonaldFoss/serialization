define([ "./primitives", "./lists/primitive/build", "./lists/structure/build", "./lists/pointer/build", "./lists/types" ], function(decode, primitive, structure, pointer, types) {
    /*
     * var TextList = pointer(Text);
     * var list = TextList.deref(segments, segment, position);
     * list.get(5); // => dereferences the text pointer at position 5, returning a Text instance.
     *
     * var WidgetList = structure(Widget);
     * var list = WidgetList.deref(segments, segment, position);
     * list.get(2); // => dereferences the widget pointer at position 2, returning a Widget instance.
     *
     * var WidgetList...List = list(list(list(structure(Widget))));
     *
     */
    /*
     * Method (pointer or struct) names the type that it accepts:
     * `structure` must take struct readers
     * `pointer` must take pointer readers (any type with a `deref` method).
     * It returns a list that itself has a `deref` method, so it can be called recursively on any list.
     */
    /*
    {
        "name" : "nestedNodes",
        "type" : {
            "meta" : "list",
            "type" : {
                "meta" : "list",
                "type" : {
                    "meta" : "list",
                    "type" : {
                        "meta" : "struct",
                        "id" : "16050641862814319170"
                    }
                }
            }
        },
        "defaultBytes" : [[[[1,254,3,55],[3,54,22,4],...],[],[],[]],[[],[]],[[],[],[],[],[],[]]],
        "offset" : 1
    }
    */
    return {
        structure: structure,
        pointer: pointer,
        Void: types.Void,
        Bool: types.Bool,
        Int8: primitive(decode.int8),
        Int16: primitive(decode.int16),
        Int32: primitive(decode.int32),
        Int64: primitive(decode.int64),
        UInt8: primitive(decode.uint8),
        UInt16: primitive(decode.uint16),
        UInt32: primitive(decode.uint32),
        UInt64: primitive(decode.uint64),
        Float32: primitive(decode.float32),
        Float64: primitive(decode.float64),
        Text: types.Text,
        Data: types.Data
    };
});