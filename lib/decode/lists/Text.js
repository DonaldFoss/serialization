define(['text-encoding', './primitives/layout', './deref'], function (
         text,                         layout,     deref) {

    var decoder = new text.TextDecoder('utf-8');

    var Text = function (list) {
        this.segments = list.segments;
        this.segment = list.segment;
        this.begin = list.begin;
        this.length = list.length;
    };

    Text.prototype.raw = function () {
        return this.segment.subarray(this.begin, this.begin+this.length-1);
    };

    Text.prototype.string = function () {
        return decoder.decode(this.raw);
    };

    Text.prototype.rawNulled = function () {
        return this.segment.subarray(this.begin, this.begin+this.length);
    };

    Text.deref = deref(Text, layout);

    return Text;
});
