var layout = require('../primitive/layout');
var m = require('../methods');
    /*
     * Lists of dereferencable stuff, excluding structures.  E.g. Text, Data,
     * List(X), AnyPointer.
     */
    module.exports = function(Nonstruct) {
        var Pointers = function(list) {
            this._segments = list.segments;
            this._segment = list.segment;
            this._begin = list.begin;
            this._length = list.length;
        };
        Pointers.prototype.get = function(index) {
            if (index < 0 || this._length <= index) {
                throw new RangeError();
            }
            return Nonstruct.deref(this._segments, this._segment, this._begin + 8 * index);
        };
        Pointers.prototype.length = function() {
            return this._length;
        };
        Pointers.prototype.map = m.map;
        Pointers.prototype.forEach = m.forEach;
        Pointers.prototype.reduce = m.reduce;
        Pointers.deref = function(segments, segment, position) {
            if ((segment[position] & 3) === 1) {
                return new Pointers(layout.intrasegment(segments, segment, position));
            } else if ((segment[position] & 3) === 2) {
                return new Pointers(layout.intersegment(segments, segment, position));
            } else {
                throw new Error("Expected a List pointer");
            }
        };
    };
