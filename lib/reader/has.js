define(['./fields'], function (fields) {

    return function (Type) {
        var has = fields.pointer.has(Type);

        Type._hasField = function (offset) {
            return function () {
                return has(this, offset);
            };
        };

        Type._unionHasField = function (disr, offset) {
            return function () {
                fields.throwOnInactive(this.which(), discr);
                return has(this, offset);
            };
        };
    };
});
