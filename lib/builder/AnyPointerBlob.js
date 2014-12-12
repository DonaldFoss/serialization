define(['../reader/AnyPointerBlob', '../reader/layout/any'], function (
                           Reader,                    any) {

    var t = Reader._TYPE;

    var Any = function (arena, isOrphan, layout) {
        this._arena = arena;
        this._isOrphan = isOrphan;
        this.__layout = layout;
    };

    Any._READER = Reader;
    Any._TYPE = t;

    Any._deref = function (arena, pointer) {
        return new Any(arena, false, any.safe(arena, pointer));
    };

    Any.prototype = {
        _TYPE : t,
        _rt : Reader.prototype._rt,
        _layout : Reader.prototype._layout
    };

    return Any;
});
