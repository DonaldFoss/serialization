var primitives = require('../primitives');
var layout = require('./primitives/layout');
var deref = require('./deref');
    var Bools = function(list) {
        this.segments = list.segments;
        this.segment = list.segment;
        this.begin = list.begin;
        this.length = list.length;
    };
    Bools.prototype.get = function(index) {
        if (index < 0 || this.length <= index) {
            throw new RangeError();
        }
        return primitives.bool(this.segment, this.begin + (index >>> 3), index & 7);
    };
    Bools.deref = deref(Bools, layout);
    module.exports = Bools;
