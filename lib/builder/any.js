define(['../reader/AnyPointer', '../reader/isNull', '../reader/list/meta', './copy/pointer', './layout/index', './AnyPointerBlob', './fields'], function (
                       Reader,             isNull,              listMeta,     copy,             layout,                     Blob,     fields) {

    var adoptLayout = function (context, ell) {
        var meta;
        if (ell.meta === 1) {
            meta = listMeta(ell);
            layout.list.nonpreallocated(
                context._arena,
                context._pointer,
                {
                    segment : ell.segment,
                    position : ell.begin - (meta.layout===7 ? 8 : 0)
                },
                meta,
                ell.length
            );
        } else {
            meta = {
                meta : 0,
                dataBytes : ell.pointersSection - ell.dataSection,
                pointersBytes : ell.end - ell.pointersSection
            };
            layout.structure.nonpreallocated(
                context._arena,
                context._pointer,
                {
                    segment : ell.segment,
                    position : ell.dataSection
                },
                meta
            );
        }
    };

    var adopt = function (context, value) {
        if (!value._isOrphan)
            throw new ValueError('Cannot adopt a non-orphan');

        if (!value._arena.isEquivTo(context._arena))
            throw new ValueError('Cannot adopt from a different arena');

        adoptLayout(context, value._layout());
    };

    var disown = function (context) {
        var instance = Blob._deref(context._arena, context._pointer);
        context._arena._zero(context._pointer, 8);
        instance._isOrphan = true;

        return instance;
    };

    var disownReadOnly = function (context) {
        var instance = Blob._READER._deref(context._arena, context._pointer, 0);
        context._arena._zero(context._pointer, 8);
        instance._isOrphan = true;

        return instance;
    };

    var disownAs = function (Type, context) {
        var instance = Type._deref(context._arena, context._pointer);
        context._arena._zero(context._pointer, 8);
        instance._isOrphan = true;

        return instance;
    };

    var disownAsReadOnly = function (Type, context) {
        var instance = Type._READER._deref(context._arena, context._pointer, 0);
        context._arena._zero(context._pointer, 8);
        instance._isOrphan = true;

        return instance;
    };

    var t = Reader._TYPE;

    var UnionAny = function (arena, pointer, discr) {
        this._arena = arena;
        this._pointer = pointer;
        this._isOrphan = false;
        this._discr = discr;
    };

    UnionAny._READER = Reader;
    UnionAny._TYPE = t;

    UnionAny._deref = function (arena, pointer, discr) {
        return new UnionAny(arena, pointer, discr);
    };

    UnionAny._set = function (arena, pointer, value) {
        if (value._TYPE === t) {
            if (value._arena.IS_READER)
                console.log('No read limits have been applied :(');

            copy.pointer.setAnyPointer(
                value._arena,
                value._pointer,
                arena,
                pointer
            );
        } else {
            if (value._arena.IS_READER)
                console.warn('No read limits have been applied :(');

            var layout = value._layout();
            if (layout.meta === 1) {
                copy.pointer.setListPointer(
                    value._arena,
                    layout,
                    arena,
                    pointer
                );
            } else {
                copy.pointer.setStructPointer(
                    value._arena,
                    layout,
                    arena,
                    pointer
                );
            }
        }
    };

    UnionAny._unionGetField = function (discr, offset, defaultPosition) {
        return function () {
            fields.throwOnInactive(this.which(), discr);
            var pointer = {
                segment : this._segment,
                position : this._pointersSection + offset
            };

            return UnionAny._deref(this._arena, pointer, discr);
        };
    };

    UnionAny._unionHasField = function (discr, offset) {
        return function () {
            fields.throwOnInactive(this.which(), discr);

            return isNull({
                segment : this._segment,
                position : this._pointersSection + offset
            });
        };
    };

    UnionAny._unionInitField = function (discr) {
        return function () {
            this._setWhich(discr);
        };
    };

    UnionAny.prototype = {
        _TYPE : t
    };

    UnionAny.prototype.adopt = function (value) {
        adopt(this, value);
        this._setWhich(this._discr);
    };

    UnionAny.prototype.disown = function () {
        return disown(this);
    };

    UnionAny.prototype.disownAs = function (Type) {
        return disownAs(Type, this);
    };

    UnionAny.prototype.disownReadOnly = function () {
        return disownReadOnly(this);
    };

    UnionAny.prototype.disownAsReadOnly = function (Type) {
        return disownAsReadOnly(Type, this);
    };

    UnionAny.prototype.getAs = function (Derefable) {
        if (!Derefable._READER)
            throw new TypeError('Must provide a builder type');

        return Derefable._deref(arena, this._pointer);
    };

    UnionAny.prototype.initAs = function (Initable, optionalLength) {
        if (!Derefable._READER)
            throw new TypeError('Must provide a builder type');

        return Initable._init(this._arena, this._pointer, optionalLength);
    };

    var NonunionAny = function (arena, pointer) {
        this._arena = arena;
        this._pointer = pointer;
        this._isOrphan = false;
    };

    NonunionAny._READER = Reader;
    NonunionAny._TYPE = t;

    NonunionAny._deref = function (arena, pointer) {
        return new NonunionAny(arena, pointer);
    };

    NonunionAny._set = function (arena, pointer, value) {
        if (value._TYPE === t) {
            if (value._arena.IS_READER)
                console.log('No read limits have been applied :(');

            copy.pointer.setAnyPointer(
                value._arena,
                value._pointer,
                arena,
                pointer
            );
        } else {
            if (value._arena.IS_READER)
                console.warn('No read limits have been applied :(');

            var layout = value._layout();
            if (layout.meta === 1) {
                copy.pointer.setListPointer(
                    value._arena,
                    layout,
                    arena,
                    pointer
                );
            } else {
                copy.pointer.setStructPointer(
                    value._arena,
                    layout,
                    arena,
                    pointer
                );
            }
        }
    };

    NonunionAny._getField = function (offset, defaultPosition) {
        return function () {
            var pointer = {
                segment : this._segment,
                position : this._pointersSection + offset
            };

            return NonunionAny._deref(this._arena, pointer);
        };
    };

    NonunionAny._hasField = function (offset) {
        return function () {
            return isNull({
                segment : this._segment,
                position : this._pointersSection + offset
            });
        };
    };

    NonunionAny.prototype = {
        _TYPE : t
    };

    NonunionAny.prototype.adopt = function (value) {
        adopt(this, value);
    };

    NonunionAny.prototype.adopt = function (value) {
        adopt(this, value);
    };

    NonunionAny.prototype.disown = function () {
        return disown(this);
    };

    NonunionAny.prototype.disownAs = function (Type) {
        return disownAs(Type, this);
    };

    NonunionAny.prototype.disownReadOnly = function () {
        return disownReadOnly(this);
    };

    NonunionAny.prototype.disownAsReadOnly = function (Type) {
        return disownAsReadOnly(Type, this);
    };

    NonunionAny.prototype.getAs = function (Derefable) {
        if (!Derefable._READER)
            throw new TypeError('Must provide a builder type');

        return Derefable._deref(arena, this._pointer);
    };

    NonunionAny.prototype.initAs = function (Initable, optionalLength) {
        if (!Derefable._READER)
            throw new TypeError('Must provide a builder type');

        return Initable._init(this._arena, this._pointer, optionalLength);
    };

    return {
        Union : UnionAny,
        Nonunion : NonunionAny
    };
});
