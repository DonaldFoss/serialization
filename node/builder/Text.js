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
    Text._setParams = function(value) {
        if (t === value._TYPE) {
            return {
                source: {
                    segment: value._segment,
                    position: value._begin
                },
                length: value._length - 1
            };
        } else if (typeof value === "string") {
            return {
                source: {
                    segment: new Buffer(value, "utf8"),
                    position: 0
                },
                length: source.segment.length
            };
        } else {
            throw new TypeError();
        }
    };
    Text._set = function(arena, pointer, params) {
        var blob = arena._preallocate(pointer.segment, params.length + 1);
        arena._write(params.source, params.length, blob);
        blob.segment[blob.position + params.length] = 0;
        layout.preallocated(pointer, blob, ct, params.length + 1);
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
