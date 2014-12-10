define(['../fields'], function (fields) {

    return function (List) {
        var get = fields.list(List);

        List._getField = function (offset, defaultPosition) {
            return function () {
                return get(defaultPosition, this, offset);
            };
        };

        List._unionGetField = function (discr, offset, defaultPosition) {
            return function () {
                fields.throwOnInactive(this.which(), discr);
                return get(defaultPosition, this, offset);
            };
        };
    };
});
