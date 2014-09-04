define([ "./layout/structure" ], function(layout) {
    return function() {
        var Type = function(arena, depth, structure) {
            if (depth > arena.maxDepth) {
                throw new Error("Exceeded nesting depth limit");
            }
            this._arena = arena;
            this._depth = depth;
            this._segment = structure.segment;
            this._dataSection = structure.dataSection;
            this._pointersSection = structure.pointersSection;
            this._end = structure.end;
            arena.limiter.read(structure.segment, structure.dataSection, structure.end - structure.dataSection);
        };
        Type.deref = function(arena, pointer, depth) {
            return new Type(arena, depth, layout.safe(arena, pointer));
        };
        Type.prototype._rt = function() {
            return {
                dataBytes: this._pointersSection - this._dataSection,
                pointersBytes: this._end - this._pointersSection
            };
        };
        Type.prototype._layout = function() {
            return {
                segment: this._segment,
                dataSection: this._dataSection,
                pointersSection: this._pointersSection,
                end: this._end
            };
        };
        return Type;
    };
});