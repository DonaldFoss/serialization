define([], function () {

    var map = function (fn) {
        var arr = [];
        for (var i=0; i<this._length; ++i) {
            arr.push(fn(this.get(i), i, this));
        }

        return arr;
    };

    var forEach = function (fn) {
        for (var i=0; i<this._length; ++i) {
            fn(this.get(i), i, this);
        }
    };

    var reduce = function (fn, acc) {
        var i=0;
        if (acc === undefined) {
            if (this._length === 0) {
                throw new TypeError();
            }

            acc = this.get(0);
            i = 1;
        }

        for (; i<this._length; ++i) {
            acc = fn(acc, this.get(i), i, this);
        }

        return acc;
    };

    return {
        map : map,
        forEach : forEach,
        reduce : reduce
    };
});
