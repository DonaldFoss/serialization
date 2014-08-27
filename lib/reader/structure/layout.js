define(['../primitives'], function (primitives) {

    return {
        data : function (datum) {
            return primitives.uint16(datum.segment, datum.position-4) << 3;
        },
        pointers : function (datum) {
            return primitives.uint16(datum.segment, datum.position-2) << 3;
        }
    };
});
