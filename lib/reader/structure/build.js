define(['./layout'], function (layout) {

    return function () {
        var Type = function (arena, depth, structure) {
            this._arena = arena;
            this._depth = depth;

            this._segment = structure.segment;
            this._dataSection = structure.dataSection;
            this._pointersSection = structure.pointersSection;
            this._end = structure.end;
        };

        Type.prototype._size = function () {
            return this._end - this._dataSection;
        };

        Type.deref = function (arena, depth, segment, position) {
            if ((segment[position] & 0x03) === 0) {
                return new Type(arena, depth, layout.intrasegment(segment, position));
            } else if ((segment[position] & 0x03) === 2) {
                return new Type(arena, depth, layout.intersegment(arena, segment, position));
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
