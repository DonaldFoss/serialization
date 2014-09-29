var Arena = require('./Arena');
    var Allocator = function() {};
    Allocator.allocate = function(bytes) {
        var segment = new Buffer(bytes);
        return segment;
    };
    Allocator.zero = function(segment, position, length) {
        if (position + length > segment._position) throw new RangeError();
        segment.fill(0, position, position + length);
    };
    Allocator.prototype.createArena = function(size) {
        return new Arena(Allocator.allocate, Allocator.zero, size);
    };
    Allocator.prototype.initRoot = function(Struct) {
        var arena = this.createArena();
        return arena.initRoot(Struct);
    };
    Allocator.prototype._fromBase64 = function(b64) {
        var nInLen = b64.indexOf("=");
        if (nInLen === -1) {
            nInLen = b64.length;
        }
        var nOutLen = nInLen * 3 + 1 >> 2;
        var arena = new Arena(Allocator.allocate, Allocator.zero, nOutLen);
        var blob = arena._allocate(nOutLen).segment;
        blob.write(b64, 0, nOutLen, "base64");
        return arena;
    };
    module.exports = Allocator;
