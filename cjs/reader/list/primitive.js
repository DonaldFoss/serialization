var deref = require('./deref');
var m = require('./methods');
    module.exports = function(decoder) {
        var Primitives = function(arena, depth, list) {
            this._arena = arena;
            this._depth = depth;
            this._segment = list.segment;
            this._begin = list.begin;
            this._dataBytes = list.dataBytes;
            this._pointersBytes = list.pointersBytes;
            this._length = list.length;
            this._stride = list.dataBytes + list.pointersBytes;
            arena.limiter.read(list.segment, list.begin, list.dataBytes * list.length);
        };
        Primitives.prototype.get = function(index) {
            if (index < 0 || this._length <= index) {
                throw new RangeError();
            }
            return decoder(this._segment, this._begin + index * this._stride);
        };
        Primitives.prototype.length = function() {
            return this._length;
        };
        Primitives.prototype.map = m.map;
        Primitives.prototype.forEach = m.forEach;
        Primitives.prototype.reduce = m.reduce;
        Primitives.prototype._rt = m.rt;
        Primitives.prototype._layout = m.layout;
        Primitives.deref = deref(Primitives);
        return Primitives;
    };
