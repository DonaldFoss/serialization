var Reader = require('../reader/Text');
var statics = require('./list/statics');
var methods = require('./list/methods');
var layout = require('./layout/list');
    var t = Reader._TYPE;
    var ct = Reader._CT;
    var Text = function(arena, layout, isDisowned) {
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
    statics.install(Text);
    Text._set = function(arena, pointer, value) {
        var source, length;
        if (t === value._TYPE) {
            source = {
                segment: value._segment,
                position: value._begin
            };
            length = value._length - 1;
        } else if (typeof value === "string") {
            source = {
                segment: new Buffer(value, "utf8"),
                position: 0
            };
            length = source.segment.length;
        } else {
            throw new TypeError();
        }
        var blob = arena._preallocate(pointer.segment, length + 1);
        arena._write(source, length, blob);
        blob.segment[blob.position + length] = 0;
        layout.preallocated(pointer, blob, ct, length + 1);
    };
    Text.prototype = {
        _TYPE: t,
        _CT: ct,
        _rt: methods.rt,
        _layout: methods.layout
    };
    Text.prototype.asBytesNull = function() {
        return this._segment.slice(this._begin, this._begin + this._length);
    };
    Text.prototype.asBytes = function() {
        return this._segment.slice(this._begin, this._begin + this._length);
    };
    Text.prototype.asString = function() {
        return this._segment.toString("utf8", this._begin, this._begin + this._length - 1);
    };
    module.exports = Text;
