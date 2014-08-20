var layout = require('./layout');
    module.exports = function() {
        var Type = function(structure) {
            this.segments = structure.segments;
            this.segment = structure.segment;
            this.dataSection = structure.dataSection;
            this.pointersSection = structure.pointersSection;
            this.end = structure.end;
        };
        Type.deref = function(segments, segment, position) {
            if (segment[position + 7] & 3 === 0) {
                return new Type(layout.intrasegment(segments, segment, position));
            } else if (segment[position + 7] & 3 === 2) {
                return new Type(layout.intersegment(segments, segment, position));
            } else {
                throw new Error("Expected a Structure pointer");
            }
        };
        return Type;
    };
