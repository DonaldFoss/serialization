define(['../layout/list'], function (layout) {

    return function (List) {
        List._deref = function (arena, pointer, depth) {
            return new List(arena, depth, false, layout.safe(arena, pointer));
        };
    };
});
