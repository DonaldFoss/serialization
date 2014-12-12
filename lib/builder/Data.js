define(['../reader/Data', './list/statics', './list/methods', './layout/list'], function (
            Reader,               statics,          methods,     layout) {

    var t = Reader._TYPE;
    var ct = Reader._CT;

    var Data = function (arena, isOrphan, listLayout) {
        this._arena = arena;
        this._isOrphan = isOrphan;

        this._segment = listLayout.segment;
        this._begin = listLayout.begin;
        this._length = listLayout.length;
        this._dataBytes = 1;
        this._pointersBytes = 0;
    };

    Data._READER = Reader;
    Data._TYPE = t;
    Data._CT = ct;

    statics.deref(Data);
    statics.adopt(Data);
    statics.disown(Data);
    statics.get(Data);
    statics.has(Data);
    statics.init(Data);

    var rawSet = function (context, object, raw) {
        var target = Data._init(
            context.arena,
            {
                segment : context._segment,
                position : context._pointersSection + offset
            },
            raw.length
        );

        // @if TARGET_ENV='browser'
        target._segment.set(
            raw,
            target._begin
        );
        // @endif

        // @if TARGET_ENV='node'
        raw.copy(
            target._segment,
            target._begin
        );
        // @endif
    };

    var objectSet = fields.list.set(Data);

    Data._setField = function (offset) {
        return function (value) {
            var setter;

            // @if TARGET_ENV='browser'
            if (value instanceof Uint8Array)
                setter = rawSet;
            else if (value._TYPE.equiv(t))
                setter = objectSet;
            else
                throw new TypeError();
            // @endif

            // @if TARGET_ENV='node'
            if (value instanceof Buffer)
                setter = rawSet;
            else if (value._TYPE.equiv(t))
                setter = objectSet;
            else
                throw new TypeError();
            // @endif

            setter(this, offset, value);
        };
    };

    Data._unionSetField = function (discr, offset) {
        return function (value) {
            var setter;

            // @if TARGET_ENV='browser'
            if (value instanceof Uint8Array)
                setter = rawSet;
            else if (value._TYPE.equiv(t))
                setter = objectSet;
            else
                throw new TypeError();
            // @endif

            // @if TARGET_ENV='node'
            if (value instanceof Buffer)
                setter = rawSet;
            else if (value._TYPE.equiv(t))
                setter = objectSet
            else
                throw new TypeError();
            // @endif

            this._setWhich(discr);
            setter(this, offset, value);
        };
    };

    Data.prototype = {
        _CT : ct,
        _TYPE : t,
        _rt : methods.rt,
        _layout : methods.layout
    };

    Data.prototype.get = function (index) {
        if (index < 0 || this._length <= index) {
            throw new RangeError();
        }

        return this._segment[this._begin + index];
    };

    Data.prototype.raw = function () {
        // @if TARGET_ENV='browser'
        return this._segment.subarray(this._begin, this._begin+this._length);
        // @endif

        // @if TARGET_ENV='node'
        return this._segment.slice(this._begin, this._begin+this._length);
        // @endif
    };

    methods.install(Data.prototype);

    return Data;
});
