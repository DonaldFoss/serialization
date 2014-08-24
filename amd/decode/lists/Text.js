define([ "text-encoding", "./primitive/layout", "./deref" ], function(text, layout, deref) {
    var decoder = new text.TextDecoder("utf-8");
    var Text = function(list) {
        this._segments = list.segments;
        this._segment = list.segment;
        this._begin = list.begin;
        this._length = list.length;
    };
    Text.prototype.asBytes = function() {
        return this._segment.subarray(this._begin, this._begin + this._length - 1);
    };
    Text.prototype.asString = function() {
        return decoder.decode(this.asBytes());
    };
    Text.prototype.asBytesNull = function() {
        return this._segment.subarray(this._begin, this._begin + this._length);
    };
    Text.deref = deref(Text, layout);
    return Text;
});