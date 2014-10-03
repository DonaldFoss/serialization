define(['../type', './list/deref', './list/methods'], function (
            type,          deref,          methods) {

    var t = new type.Terminal();

    var ct = {
        meta : 1,
        layout : 2,
        dataBytes : 1,
        pointersBytes : 0
    };

    var Text = function (arena, depth, list) {
        this._arena = arena;
        this._depth = depth;

        this._segment = list.segment;
        this._begin = list.begin;
        this._length = list.length;
        this._dataBytes = 1;
        this._pointersBytes = 0;

        this._arena.limiter.read(list.segment, list.begin, list.length);
    };

    Text._TYPE = t;
    Text._CT = ct;
    Text._deref = deref(Text);

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

    Text.prototype.asString = function () {
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
