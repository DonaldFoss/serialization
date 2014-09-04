var deref = require('./deref');
var m = require('./methods');
    var Voids = function(arena, depth, list) {
        this._arena = arena;
        this._depth = depth;
        this._segment = list.segment;
        this._length = list.length;
    };
    Voids.prototype._begin = 0;
    Voids.prototype._dataBytes = 0;
    Voids.prototype._pointersBytes = 0;
    Voids.prototype.get = function(index) {
        if (index < 0 || this._length <= index) {
            throw new RangeError();
        }
        return null;
    };
    Voids.prototype.length = function() {
        return this._length;
    };
    Voids.prototype.map = m.map;
    Voids.prototype.forEach = m.forEach;
    Voids.prototype.reduce = m.reduce;
    Voids.prototype._rt = m.rt;
    Voids.prototype._layout = m.layout;
    Voids.deref = deref(Voids);
    module.exports = Voids;
