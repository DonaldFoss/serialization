define(['./far', './layout'], function (far, layout) {

    return function () {
        var Type = function (arena, datum, depth) {
            if (depth > arena.maxDepth) {
                throw new Error('Exceeded nesting depth limit');
            }

            this._arena = arena;
            this._datum = datum;
            this._depth = depth;

            var tag = datum;
            if (!far.isLocal(datum)) {
                tag = far.tag(arena, datum);
                if (far.isSingle(datum)) {
                    datum = tag;
                } else {
                    datum = far.start(tag);
                }
            }

            arena.limiter.read(
                datum.segment,
                datum.position,
                layout.data(tag) + layout.pointers(tag)
            );
        };

        Type.deref = function (arena, datum, depth) {
            var typeBits = datum.segment[datum.position-8] & 0x03;
            if (typeBits !== 0 && typeBits !== 2) {
                throw new Error('Expected a Structure pointer');
            }

            return new Type(arena, datum, depth);
        };

        return Type;
    };
});
