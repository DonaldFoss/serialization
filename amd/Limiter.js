define([], function() {
    var Limiter = function(maxBytes) {
        this._read = 0;
        this.maxBytes = maxBytes;
    };
    Limiter.prototype.read = function(bytes) {
        this._read += bytes;
        if (this._read > maxBytes) {
            throw new Error("Read limit exceeded");
        }
    };
    Limiter.prototype.unread = function(bytes) {
        this._read -= bytes;
    };
    return Limiter;
});