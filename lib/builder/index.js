define(['./primitives', './fields', './generic', './structure', './group', './list/index', './AnyPointer', './AnyPointerBlob', './Text', './Data', './zero'], function (
           primitives,     fields,     generic,     structure,     group,     lists,          AnyPointer,     AnyPointerBlob,     Text,     Data,     zero) {

    return {
        primitives : primitives,
        fields : fields,
        generic : generic,
        structure : structure,
        group : group,
        lists : lists,
        AnyPointer : AnyPointer,
        AnyPointerBlob : AnyPointerBlob,
        Text : Text,
        Data : Data,
        zero : zero
    };
});
