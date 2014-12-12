define(['../type', './layout/any', './methods', './list/methods'], function (
            type,            any,   structure,     list) {

    var t = new type.Terminal();

    var Any = function (arena, depth, isOrphan, layout) {
        this._arena = arena;
        this._depth = depth;
        this._isOrphan = isOrphan;

        this.__layout = layout;

        if (layout.meta === 0) {
            this._arena.limiter.read(
                layout.segment,
                layout.dataSection,
                layout.end - layout.dataSection
            );
        } else {
            this._arena.limiter.read(
                layout.segment,
                layout.begin,
                layout.length
            );
        }
    };

    Any._TYPE = t;

    Any._deref = function (arena, pointer, depth) {
        return new Any(arena, depth, false, any.safe(arena, pointer));
    };

    Any.prototype = {
        _TYPE : t,
        _rt : function () {
            if (this.__layout.meta === 1) return list.rt();
            else return structure.rt();
        },
        _layout : function () {
            return this.__layout;
        }
    };

    return Any;
});
