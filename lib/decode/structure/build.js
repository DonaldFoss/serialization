define(['./layout'], function (layout) {

    return function () {
        var Type = function (structure) {
            this._segments = structure.segments;
            this._segment = structure.segment;
            this._dataSection = structure.dataSection;
            this._pointersSection = structure.pointersSection;
            this._end = structure.end;
        };

        Type.prototype._size = function () {
            return this._end - this._dataSection;
        };

        Type.deref = function (segments, segment, position) {
            if ((segment[position] & 0x03) === 0) {
                return new Type(layout.intrasegment(segments, segment, position));
            } else if ((segment[position] & 0x03) === 2) {
                return new Type(layout.intersegment(segments, segment, position));
            } else {
                throw new Error('Expected a Structure pointer');
            }
        };

        /* Helper to allow a structure to inject its state into its groups. */
        Type.inject = function (state) {
            return new Type({
                segments : state._segments,
                segment : state._segment,
                dataSection : state._dataSection,
                pointersSection : state._pointersSection,
                end : state._end
            });
        };

        return Type;
    };
});
