define(['../../primitives', './layout', '../deref'], function (
               primitives,     layout,      deref) {

    return function (decoder) {
        var Primitives = function (list) {
            this.segments = list.segments;
            this.segment = list.segment;
            this.begin = list.begin;
            this.stride = list.dataBytes;
            this.length = list.length;
        };

        Primitives.prototype.get = function (index) {
            if (index < 0 || this.length <= index) {
                throw new RangeError();
            }

            return decoder(this.segment, this.begin + this.stride * index);
        };

        Primitives.deref = deref(Primitives, layout);

        return Primitives;
    };
});
