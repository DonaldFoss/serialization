define(['../type', './layout/any'], function (
            type,            any) {

    var t = new type.Terminal();

    var Any = function (arena, pointer, depth) {
        this._arena = arena;
        this._pointer = pointer;

        /*
         * The caller is responsible for setting depth.  This parameter just
         * passes through.
         */
        this._depth = depth;

        this.__layout = any(arena, pointer);
    };

    Any._TYPE = t;

    Any._deref = function (arena, pointer, depth) {
        return new Any(arena, pointer, depth);
    };

    Any.prototype = {
        _TYPE : t
    };

    Any.prototype.cast = function (Derefable) {
        if (Derefable._READER) {
            // User provided a builder.  Use the associated reader.
            Derefable = Derefable._READER;
        }

        return new Derefable(this._arena, this._depth, this.__layout);
    };

    Any.prototype._layout = function () { return this.__layout; };

    return Any;
});
