define(['../reader/AnyPointer', '../reader/layout/any'], function (
                       Reader,             layout) {

    var t = Reader._TYPE;

    var Any = function (arena, pointer, depth) {
        this._arena = arena;
        this._pointer = pointer;

        /*
         * The caller is responsible for setting depth.  This parameter just
         * passes through.
         */
        this._depth = depth;

        this._layout = layout(arena, pointer);
    };

    Any._READER = Reader;
    Any._TYPE = t;

    Any.prototype = {
        _TYPE : t
    };

    Any.prototype.cast = function (Derefable) {
        if (!Derefable._READER) {
            /*
             * User provided a reader.  Wrap a reader arena around the builder
             * arena's data to parametrize the Derefable.
             */
            return new Derefable(
                this._arena.asReader(),
                this._depth,
                this._layout
            );
        }

        return new Derefable(this._arena, this._depth, this._layout);
    };

    return Any;
});
