define(['./layout'], function (layout) {

    return function () {
        var Type = function (arena, depth, structure) {
            if (depth > arena.maxDepth) {
                throw new Error('Exceeded nesting depth limit');
            }

            this._arena = arena;
            this._depth = depth;

            this._segment = structure.segment;
            this._dataSection = structure.dataSection;
            this._pointersSection = structure.pointersSection;
            this._end = structure.end;

            arena.limiter.read(
                structure.segment,
                structure.dataSection,
                structure.end - structure.dataSection
            );
        };

        Type.deref = function (arena, datum, depth) {
            var typeBits = datum.segment[datum.position] & 0x03;

            if (typeBits === 0) {
                return new Type(arena, depth, layout.intrasegment(datum));
            } else if (typeBits === 2) {
                return new Type(arena, depth, layout.intersegment(arena, datum));
            } else {
                throw new Error('Expected a Structure pointer');
            }
        };

        /* Helper to allow a structure to inject its state into its groups. */
        Type.inject = function (state) {
            return new Type(state._arena, state._depth, {
                segment : state._segment,
                dataSection : state._dataSection,
                pointersSection : state._pointersSection,
                end : state._end
            });
        };

        return Type;
    };
});
