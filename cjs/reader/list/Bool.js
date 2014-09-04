var primitives = require('../primitives');
var deref = require('./deref');
var m = require('./methods');
    var Bools = function(arena, depth, list) {
        this._arena = arena;
        this._depth = depth;
        this._segment = list.segment;
        this._begin = list.begin;
        this._length = list.length;
        this._dataBytes = list.dataBytes;
        this._pointersBytes = list.pointersBytes;
        this._stride = list.dataBytes + list.pointersBytes;
        arena.limiter.read(list.segment, list.begin, Math.ceil(list.length / 8));
    };
    Bools.prototype.get = function(index) {
        if (index < 0 || this._length <= index) {
            throw new RangeError();
        }
        if (this._dataBytes === null) {
            // Still single bits.
            return !!primitives.bool(this._segment, this._begin + (index >>> 3), index & 7);
        } else {
            /*
             * There exists a new version that has upgraded to non-single-bit
             * structures.
             */
            return !!(this._segment[this._begin + index * this._stride] & 128);
        }
    };
    Bools.prototype.length = function() {
        return this._length;
    };
    Bools.prototype.map = m.map;
    Bools.prototype.forEach = m.forEach;
    Bools.prototype.reduce = m.reduce;
    Bools.prototype._rt = m.rt;
    Bools.prototype._layout = m.layout;
    Bools.deref = deref(Bools);
    module.exports = Bools;
