define(['./safe', './unsafe', './subwordList', './inlineCompositeList'], function (
           safe,     unsafe,     subwordList,     inlineCompositeList) {

    var intrasegment = function (pointer) {
        if ((pointer.segment[pointer.position + 4] & 0x07) === 0x07) {
            return inlineCompositeList.intrasegment(pointer);
        } else {
            return subwordList.intrasegment(pointer);
        }
    };

    var intersegment = function (tag, blob) {
        if ((tag.segment[tag.position + 4] & 0x07) === 0x07) {
            return inlineCompositeList.intersegment(tag, blob);
        } else {
            return subwordList.intersegment(tag, blob);
        }
    };

    return {
        safe : safe(intrasegment, intersegment, 1),
        unsafe : unsafe(intrasegment, intersegment, 1),
        intrasegment : intrasegment,
        intersegment : intersegment
    };
});
