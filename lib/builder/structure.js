define(['../reader/layout/structure', '../reader/methods', './layout/structure', './fields', './upgrade'], function (
            reader,                              methods,              builder,     fields,     upgrade) {

    return function (Reader) {
        var t = Reader._TYPE;
        var ct = Reader._CT;

        var Structure = function (arena, isOrphan, layout) {
            this._arena = arena;
            this._isOrphan = isOrphan;

            this._segment = layout.segment;
            this._dataSection = layout.dataSection;
            this._pointersSection = layout.pointersSection;
            this._end = layout.end;
        };

        Structure._READER = Reader;
        Structure._TYPE = t;
        Structure._CT = ct;
        Structure._LIST_CT = Reader._LIST_CT;
        Structure._HASH = Reader._HASH;

        Structure._deref = function (arena, pointer) {
            var instance = new Structure(
                arena,
                false,
                reader.unsafe(arena, pointer)
            );

            // Upgrade the blob if the pointer derived from an old version.
            var rt = instance._rt();
            if (rt.dataBytes < ct.dataBytes
             || rt.pointersBytes < ct.pointersBytes) {
                upgrade.structure(instance._arena, pointer, ct);
                return new Structure(
                    arena,
                    false,
                    reader.unsafe(arena, pointer)
                );
            }

            return instance;
        };

        Structure._init = function (arena, pointer) {
            var ctSize = ct.dataBytes + ct.pointersBytes;
            var blob = arena._preallocate(pointer.segment, ctSize);

            // @if TARGET_ENV='node'
            arena._zero(blob, ctSize);
            // @endif

            builder.preallocated(pointer, blob, ct);

            return new Structure(arena, false, reader.unsafe(arena, pointer));
        };

        Structure._initOrphan = function (arena) {
            var ctSize = ct.dataBytes + ct.pointersBytes;
            var blob = arena._allocateOrphan(ctSize);

            // @if TARGET_ENV='node'
            arena._zero(blob, ctSize);
            // @endif

            return new Structure(
                arena,
                true,
                {
                    segment : blob.segment,
                    dataSection : blob.position,
                    pointersSection : blob.position + ct.dataBytes,
                    end : blob.position + ctSize
                }
            );
        };

        var adopt = fields.pointer.adopt(Structure);

        Structure._adoptField = function (offset) {
            return function (value) {
                adopt(this, offset, value);
            };
        };

        Structure._unionAdoptField = function (discr, offset) {
            return function (value) {
                this._setWhich(discr);
                adopt(this, offset, value);
            };
        };

        var disown = fields.pointer.disown(Structure);
        var disownReader = fields.pointer.disownReader(Reader);

        Structure._disownField = function (offset) {
            return function () {
                return disown(this, offset);
            };
        };

        Structure._unionDisownField = function (discr, offset) {
            return function () {
                fields.throwOnInactive(this.which(), discr);
                return disown(this, offset);
            };
        };

        Structure._disownReaderField = function (offset) {
            return function () {
                return disownReader(this, offset);
            };
        };

        Structure._unionDisownReaderField = function (discr, offset) {
            return function () {
                fields.throwOnInactive(this.which(), discr);
                return disownReader(this, offset);
            };
        };

        var get = fields.struct.get(Structure);

        Structure._getField = function (offset, defaultPosition) {
            return function () {
                return get(defaultPosition, this, offset);
            };
        };

        Structure._unionGetField = function (discr, offset, defaultPosition) {
            return function () {
                fields.throwOnInactive(this.which(), discr);
                return get(defaultPosition, this, offset);
            };
        };

        var has = fields.pointer.has();

        Structure._hasField = function (offset) {
            return function () {
                return has(this, offset);
            };
        };

        Structure._unionHasField = function (discr, offset) {
            return function () {
                fields.throwOnInactive(this.which(), discr);
                return has(this, offset);
            };
        };

        var init = fields.struct.init(Structure);

        Structure._initField = function (offset) {
            return function () {
                return init(this, offset);
            };
        };

        Structure._unionInitField = function (discr, offset) {
            return function () {
                this._setWhich(discr);
                return init(this, offset);
            };
        };

        var set = fields.struct.set(Structure);

        Structure._setField = function (offset) {
            return function (value) {
                set(this, offset, value);
            };
        };

        Structure._unionSetField = function (discr, offset) {
            return function (value) {
                this._setWhich(discr);
                set(this, offset, value);
            };
        };

        Structure.prototype = {
            _TYPE : t,
            _CT : ct,
            _rt : methods.rt,
            _layout : methods.layout
        };

        Structure.prototype._maskData = function (position, mask) {
            this._segment[this._dataSection + position] &= mask;
        };

        Structure.prototype._zeroData = function (position, length) {
            this._arena._zero(
                {
                    segment : this._segment,
                    position : this._dataSection + position
                },
                length
            );
        };

        return Structure;
    };
});
