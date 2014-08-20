define(['./primitives/layout', './deref'], function (layout, deref) {

    var Voids = function (list) {
        this.segments = list.segments;
        this.segment = list.segment;
        this.length = list.length;
    };

    Voids.prototype.get = function (index) {
        if (index < 0 || this.length <= index) {
            throw new RangeError();
        }

        return null;
    };

    Voids.deref = deref(Voids, layout);

    return Voids;
});
