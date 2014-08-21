define(['./primitive/layout', './deref'], function (layout, deref) {

    var Voids = function (list) {
        this._segments = list.segments;
        this._segment = list.segment;
        this._length = list.length;
    };

    Voids.prototype.get = function (index) {
        if (index < 0 || this._length <= index) {
            throw new RangeError();
        }

        return null;
    };

    Voids.prototype.length = function () { return this._length; };

    Voids.deref = deref(Voids, layout);

    return Voids;
});
