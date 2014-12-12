define(['../fields'], function (fields) {

    return function (List) {
        var adopt = fields.list.adopt();

        List._adoptField = function (offset) {
            return function (value) {
                if (!List._TYPE.equiv(value._TYPE)) throw new TypeError();
                adopt(this, offset, value);
            };
        };

        List._unionAdoptField = function (discr, offset) {
            return function (value) {
                if (!List._TYPE.equiv(value._TYPE)) throw new TypeError();
                adopt(this, offset, value);
                this._setWhich(discr);
            };
        };
    };
});
