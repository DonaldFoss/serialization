define(['../reader/AnyPointerBlob', '../reader/isNull', '../reader/layout/any', '../reader/list/sizes', './copy/pointer'], function (
                           Reader,             isNull,                    any,                  sizes,     copy) {

    var t = Reader._TYPE;

    var Any = function (arena, layout, isDisowned) {
        this._arena = arena;
        this.__layout = layout;
        this._isDisowned = isDisowned;
    };

    Any._READER = Reader;
    Any._TYPE = t;

    Any._adopt = function (arena, pointer, value) {
        if (!value._isDisowned) {
            throw new ValueError('Cannot adopt a non-orphan');
        }

        if (arena.isEquivTo(value._arena)) {
            throw new ValueError('Cannot adopt from a different arena');
        }

        copy.shallow(value, pointer);
        value._isDisowned = false;
    };

    Any._copyFrom = function (arena, pointer) {
        var layout = any.unsafe(arena, pointer);

        var blob
        switch (layout.meta) {
        case 0:
            blob = arena._allocate(layout.end - layout.dataSection);
        case 1:
            if (layout.
            blob = arena._allocate(layout.
        }

        var layout;
        if (isNull(pointer)) {
            layout = {
                meta : 1,
                segment : pointer.segment,
                begin : pointer.position,
                length : 0,
                dataBytes : 0,
                pointersBytes : 0
            };
        } else {
            
            arena._zero(pointer, 8);
        }

        return new Any(arena, layout, true);
    };

    Any._disownAsStructure = function (arena, pointer) {
        var layout = any.unsafe(arena, pointer);
        arena._zero(pointer, 8);

        return new Any(arena, layout, true);
    };

    Any.prototype = {
        _TYPE : t
    };

    Any.prototype._rt = function () {
        var ell = this.__layout;
        if (ell.meta === 0) {
            return {
                meta : 0,
                dataBytes : ell.pointersSection - ell.dataSection,
                pointersBytes : ell.end - ell.pointersSection
            };
        } else if (ell.meta === 1) {
            var layout;
            if (ell.dataBytes === null) {
                layout = 0x01;
            } else if (ell.dataBytes + ell.pointersBytes > 8) {
                layout = 0x07;
            } else {
                layout = sizes[ell.dataBytes][ell.pointersBytes];
            }

            return {
                meta : 1,
                layout : layout,
                dataBytes : ell.dataBytes,
                pointersBytes : ell.pointersBytes
            };
        }
    };

    Any.prototype._layout = function () { return this.__layout; };

    return Any;
});
