define(['../reader/Text', './list/statics', './list/methods', './layout/list'], function (
            Reader,               statics,          methods,     layout) {

    var t = Reader._TYPE;
    var ct = Reader._CT;

    var Text = function (arena, layout, isDisowned) {
        this._arena = arena;
        this._isDisowned = isDisowned;

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
        var uintArray = [];
        for (var i = 0; i<string.length; ++i) {
            uintArray.push(string.charCodeAt(i));
        }
        return new Uint8Array(uintArray);
    };
    // @endif

    statics.install(Text);

    Text._set = function (arena, pointer, value) {
        var source, length;
        if (t === value._Type) {
            source = {
                segment : value._segment,
                position : value._begin
            };
            length = value._length - 1;
        } else if (typeof value === 'string') {
            // @if TARGET_ENV='browser'
            source = {
                segment : Text._encode(value),
                position : 0
            };
            // @endif

            // @if TARGET_ENV='node'
            source = {
                segment : new Buffer(value, 'utf8'),
                position : 0
            };
            // @endif

            length = source.segment.length;
        } else {
            throw new TypeError();
        }

        var blob = arena._preallocate(pointer.segment, length+1);
        arena._write(source, length, blob);
        blob.segment[length] = 0;
        layout.preallocated(pointer, blob, ct, length+1);
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
        return this._segment.subarray(this._begin, this._begin+this._length);
        // @endif

        // @if TARGET_ENV='node'
        return this._segment.slice(this._begin, this._begin+this._length);
        // @endif
    };

    Text.prototype.asString = function () {
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
