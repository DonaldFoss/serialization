define(['./fields'], function (fields) {

    return function (Type) {
        var get = fields.pointer.get(List);

        Type._getField = function (offset, defaultPosition) {
            return function () {
                return get(defaultPosition, this, offset);
            };
        };

        Type.unionGetField = function (discr, offset, defaultPosition) {
            return function () {
                fields.throwOnInactive(this.which(), discr);
                return get(defaultPosition, this, offset);
            };
        };
    };
});
