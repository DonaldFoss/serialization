var Reader = require('../../reader/list/Void');
var statics = require('./statics');
var methods = require('./methods');
    var t = Reader._TYPE;
    var ct = Reader._CT;
    var Voids = function(arena, layout, isDisowned) {
        this._arena = arena;
        this._isDisowned = isDisowned;
        this._segment = layout.segment;
        this._begin = layout.begin;
        this._length = layout.length;
        this._dataBytes = layout.dataBytes;
        this._pointersBytes = layout.pointersBytes;
        this._stride = layout.dataBytes + layout.pointersBytes;
    };
    Voids._READER = Reader;
    Voids._TYPE = t;
    Voids._CT = ct;
    statics.install(Voids);
    Voids.prototype = {
        _TYPE: t,
        _CT: ct,
        _rt: methods.rt,
        _layout: methods.layout
    };
    Voids.prototype.get = Reader.prototype.get;
    module.exports = Voids;
