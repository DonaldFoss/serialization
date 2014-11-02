define(['../reader/AnyPointer', './AnyPointerBlob'], function (
                       Reader,               Blob) {

    var t = Reader._TYPE;

    var Any = function (arena, pointer) {
        this._arena = arena;
        this._pointer = pointer;
    };

    Any._READER = Reader;
    Any._TYPE = t;

    Any._deref = function (arena, pointer) {
        return new Any(arena, pointer);
    };

    Any.prototype = {
        _TYPE : t
    };

    Any.prototype.getAs = function (Derefable) {
        var arena = this._arena;
        if (!Derefable._READER) {
            /*
             * User provided a reader.  Wrap a reader arena around the builder
             * arena's data to parametrize the Derefable.
             */
            arena = arena.asReader();
        }

        return Derefable._deref(arena, this._pointer);
    };

    Any.prototype.initAs = function (Derefable) {
        if (!Derefable._READER)
            throw new TypeError('Cannot initialize an AnyPointer with a reader type');

        return Derefable._init(this._arena, this._pointer);
    };

    Any.prototype.cloneAsOrphan = function () {
        return new Blob(this._arena, this._pointer);
    };
});
