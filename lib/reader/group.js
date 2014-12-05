define(['./methods'], function (methods) {

    return function (parentType) {
        var Group = function (parent) {
            var layout = parent._layout();

            this._arena = parent._arena;
            this._depth = parent._depth;
            this._isOrphan = false;

            this._segment = layout.segment;
            this._dataSection = layout.dataSection;
            this._pointersSection = layout.pointersSection;
            this._end = layout.end;
        };

        Group._PARENT = parentType;

        Group.prototype = {
            _PARENT : parentType,
            _rt : methods.rt,
            _layout : methods.layout
        };

        return Group;
    };
});
