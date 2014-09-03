define(['./primitives'], function (primitives) {

    var next = function (arena, pointer) {
        return {
            segment : arena.getSegment(primitives.uint32(
                pointer.segment,
                pointer.position+4
            )),
            position : primitives.uint32(
                pointer.segment,
                pointer.position
            ) & 0xfffffff8
        };
    };

    return {
        next : next,
        tag : function (arena, pointer) {
            var land = next(arena, pointer);
            land.position += ((pointer.segment[pointer.position] & 0x04) << 1);

            return land;
        },
        blob : function (arena, pointer) {
            var land = next(arena, pointer);
            if (pointer.segment[pointer.position] & 0x04) {
                return next(arena, land);
            } else {
                var half = primitives.uint32(
                    land.segment,
                    land.position
                ) & 0xfffffffc;

                land.position += 8 + half + half;

                return land;
            }
        }
    };
});
