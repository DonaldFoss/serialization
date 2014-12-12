define(['../type', './list/statics', './list/methods'], function (
            type,          statics,          methods) {

    var t = new type.Terminal();

    var ct = {
        meta : 1,
        layout : 2,
        dataBytes : 1,
        pointersBytes : 0
    };

    var Text = function (arena, depth, isOrphan, layout) {
        this._arena = arena;
        this._depth = depth;
        this._isOrphan = isOrphan;

        this._segment = layout.segment;
        this._begin = layout.begin;
        this._length = layout.length;
        this._dataBytes = 1;
        this._pointersBytes = 0;

        this._arena.limiter.read(layout.segment, layout.begin, layout.length);
    };

    Text._TYPE = t;
    Text._CT = ct;
    statics.install(Text);

    // @if TARGET_ENV='browser'
    // http://stackoverflow.com/questions/17191945/conversion-between-utf-8-arraybuffer-and-string#answer-17192845
    Text._decode = function (uintArray) {
        var encodedString = String.fromCharCode.apply(null, uintArray);
        return decodeURIComponent(escape(encodedString));
    };
    // @endif

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
        return Text._decode(this.asBytes());
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
