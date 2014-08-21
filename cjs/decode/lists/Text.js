var text = require('text-encoding');
var layout = require('./primitive/layout');
var deref = require('./deref');
    var decoder = new text.TextDecoder("utf-8");
    var Text = function(list) {
        this.segments = list.segments;
        this.segment = list.segment;
        this.begin = list.begin;
        this.length = list.length;
        console.log("Text begin:" + list.begin);
        console.log("Text length:" + list.length);
    };
    Text.prototype.asBytes = function() {
        return this.segment.subarray(this.begin, this.begin + this.length - 1);
    };
    Text.prototype.asString = function() {
        return decoder.decode(this.asBytes());
    };
    Text.prototype.asBytesNull = function() {
        return this.segment.subarray(this.begin, this.begin + this.length);
    };
    Text.deref = deref(Text, layout);
    module.exports = Text;
