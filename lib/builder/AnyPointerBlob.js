define(['../reader/AnyPointerBlob', '../reader/isNull', '../reader/layout/any'], function (
                           Reader,             isNull,                    any) {

    var t = Reader._TYPE;

    var Any = function (arena, pointer) {
        this._arena = arena;
        this._isDisowned = true;
        this._isNull = isNull(pointer);

        this.__layout = any.unsafe(arena, pointer);
    };

    Any._READER = Reader;
    Any._TYPE = t;

    Any.prototype = {
        _TYPE : t
    };

    Any.prototype._layout = function () { return this.__layout; };

    return Any;
});
