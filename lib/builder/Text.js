define(['../reader/Text', './list/statics', './list/methods', './layout/list'], function (
            Reader,               statics,          methods,     layout) {

    var t = Reader._TYPE;
    var ct = Reader._CT;

    var Text = function (arena, isOrphan, layout) {
        this._arena = arena;
        this._isOrphan = isOrphan;

        this._segment = layout.segment;
        this._begin = layout.begin;
        this._length = layout.length;
        this._dataBytes = 1;
        this._pointersBytes = 0;
    };

    Text._READER = Reader;
    Text._TYPE = t;
    Text._CT = ct;

    // @if TARGET_ENV='browser'
    Text._decode = Reader._decode;

    // http://stackoverflow.com/questions/17191945/conversion-between-utf-8-arraybuffer-and-string#answer-17192845
    Text._encode = function (string) {
        string = unescape(encodeURIComponent(string));
        var uintArray = new Uint8Array(string.length);
        for (var i = 0; i<string.length; ++i) {
            uintArray[i] = string.charCodeAt(i);
        }
        return uintArray;
    };
    // @endif

    statics.deref(Text);
    statics.adopt(Text);
    statics.disown(Text);
    statics.get(Text);
    statics.has(Text);

    Text._init = function (arena, pointer, length) {
        var blob = arena._preallocate(pointer.segment, length);

        // @if TARGET_ENV='node'
        arena._zero(blob, size);
        // @endif

        list.preallocated(pointer, blob, ct, length);

        return new Text(arena, false, reader.unsafe(arena, pointer));
    };

    var init = fields.list.init(Text);

    Text._initField = function (offset) {
        return function (length) {
            return init(this, offset, length+1);
        };
    };

    Text._unionInitField = function (discr, offset) {
        return function (length) {
            this._setWhich(discr);
            return init(this, offset, length+1);
        };
    };

    var stringSet = function (context, offset, str) {
        // @if TARGET_ENV='browser'
        str = Text._encode(textish);
        // @endif

        // @if TARGET_ENV='node'
        str = new Buffer(textish, 'utf8');
        // @endif

        var target = Text._init(
            context.arena,
            {
                segment : context._segment,
                position : context._pointersSection + offset
            },
            str.length+1
        );

        // @if TARGET_ENV='browser'
        target._segment.set(
            str,
            target._begin
        );
        // @endif

        // @if TARGET_ENV='node'
        str.copy(
            target._segment,
            target._begin
        );
        // @endif
    };

    var objectSet = fields.list.set(Text);

    Text._setField = function (offset) {
        return function (value) {
            if (typeof value === 'string') {
                stringSet(this, offset, value);
            } else {
                objectSet(this, offset, value);
            }
        };
    };

    Text._unionSetField = function (discr, offset) {
        return function (value) {
            if (typeof value === 'string') {
                stringSet(this, offset, value);
            } else {
                objectSet(this, offset, value);
            }
            this._setWhich(discr);
        };
    };

    Text.prototype = {
        _TYPE : t,
        _CT : ct,
        _rt : methods.rt,
        _layout : methods.layout
    };

    Text.prototype.asBytesNull = function () {
        // @if TARGET_ENV='browser'
        return this._segment.subarray(this._begin, this._begin+this._length);
        // @endif

        // @if TARGET_ENV='node'
        return this._segment.slice(this._begin, this._begin+this._length);
        // @endif
    };

    Text.prototype.asBytes = function () {
        // @if TARGET_ENV='browser'
        return this._segment.subarray(this._begin, this._begin+this._length-1);
        // @endif

        // @if TARGET_ENV='node'
        return this._segment.slice(this._begin, this._begin+this._length-1);
        // @endif
    };

    Text.prototype.toString = function () {
        // @if TARGET_ENV='browser'
        return Reader._decode(this.asBytes());
        // @endif

        // @if TARGET_ENV='node'
        return this._segment.toString(
            'utf8',
            this._begin,
            this._begin + this._length - 1
        );
        // @endif
    };

    return Text;
});
