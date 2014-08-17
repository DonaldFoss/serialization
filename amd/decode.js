define(['./decode/primitives', './decode/fields', './decode/structure', './decode/lists', './decode/AnyPointer'], function (
                  primitives,            fields,            structure,            lists,            AnyPointer) {

    return {
        primitives : primitives,
        fields : fields,
        structure : structure,
        lists : lists,
        AnyPointer : AnyPointer
    };
});
