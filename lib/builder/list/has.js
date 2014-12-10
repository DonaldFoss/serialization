define(['../fields'], function () {

    return function (List) {
        var has = fields.pointer.has();

        List._hasField = function (offset) {
            return has(this, offset);
        };

        List._unionHasField = function (discr, offset) {
            fields.throwOnInactive(this.which(), discr);
            return has(this, offset);
        };
    };
});
