define(['./layout', '../deref'], function (layout, deref) {

    return function (Reader) {
        var Structs = function (list) {
            this.segments = list.segments;
            this.segment = list.segment;
            this.begin = list.begin;
            this.stride = list.dataBytes + list.pointersBytes;
            this.length = list.length;
            this.dataBytes = list.dataBytes;
            this.pointersBytes = list.pointersBytes;
        };

        Structs.prototype.get = function (index) {
            if (index < 0 || this.length <= index) {
                throw new RangeError();
            }

            var position = this.begin + this.stride * index;
            var pointers = position + this.dataBytes;

            return new Reader({
                segments : this.segments,
                segment : this.segment,
                dataSection : position,
                pointersSection : pointers,
                end : pointers + this.pointersBytes
            });
        };

        Structs.deref = deref(Structs, layout);

        return Structs;
    };
});
