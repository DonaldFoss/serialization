var Reader = require('../../reader/list/Data');
var deref = require('./deref');
var init = require('./init');
var methods = require('./methods');
    var Data = function(arena, list) {
        this._arena = arena;
        this._segment = list.segment;
        this._begin = list.begin;
        this._length = list.length;
        this._dataBytes = 1;
        this._pointersBytes = 0;
    };
    Data._CT = Data.prototype._CT = Reader._CT;
    Data._TYPE = Data.prototype._TYPE = Reader._TYPE;
    Data._deref = deref(Data);
    Data._init = init(Data);
    Data.prototype.get = Reader.prototype.get;
    Data.prototype.set = function(index, value) {
        this._segment[this._begin + index] = value;
    };
    Data.prototype.raw = Reader.prototype.raw;
    methods.install(Data.prototype);
    module.exports = Data;
