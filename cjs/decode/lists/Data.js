var layout = require('./primitive/layout');
var deref = require('./deref');
    var Data = function(list) {
        this.segments = list.segments;
        this.segment = list.segment;
        this.begin = list.begin;
        this.length = list.length;
    };
    Data.prototype.get = function(index) {
        if (index < 0 || this.length <= index) {
            throw new RangeError();
        }
        return this.segment[this.begin + index];
    };
    Data.prototype.raw = function() {
        return this.segment.subarray(this.begin, this.begin + this.length);
    };
    Data.deref = deref(Data, layout);
    module.exports = Data;
