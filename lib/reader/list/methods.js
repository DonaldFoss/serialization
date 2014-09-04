define(['./sizes'], function (sizes) {

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

    var rt = function () {
        var runtime = {
            dataBytes : this._dataBytes,
            pointersBytes : this._pointersBytes,
            length : this._length
        };

        if (this._dataBytes === null) {
            runtime.size = 0x01;
        } else if (this._dataBytes + this._pointersBytes > 8) {
            runtime.size = 0x07;
        } else {
            runtime.size = sizes[this._dataBytes][this._pointersBytes];
        }

        return runtime;
    };

    var layout = function () {
        return {
            segment : this._segment,
            begin : this._begin,
            length : this._length,
            dataBytes : this._dataBytes,
            pointersBytes : this._pointersBytes
        };
    };

    return {
        map : map,
        forEach : forEach,
        reduce : reduce,
        rt : rt,
        layout : layout
    };
});
