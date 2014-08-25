var primitives = require('../../primitives');
var layout = require('./layout');
var deref = require('../deref');
var m = require('../methods');
    module.exports = function(decoder) {
        var Primitives = function(arena, depth, list) {
            this._arena = arena;
            this._depth = depth;
            this._segment = list.segment;
            this._begin = list.begin;
            this._stride = list.dataBytes;
            this._length = list.length;
        };
        Primitives.prototype.get = function(index) {
            if (index < 0 || this._length <= index) {
                throw new RangeError();
            }
            return decoder(this._segment, this._begin + this._stride * index);
        };
        Primitives.prototype.length = function() {
            return this._length;
        };
        Primitives.prototype.map = m.map;
        Primitives.prototype.forEach = m.forEach;
        Primitives.prototype.reduce = m.reduce;
        Primitives.prototype._size = function() {
            return this._length * this._stride;
        };
        Primitives.deref = deref(Primitives, layout);
        return Primitives;
    };
