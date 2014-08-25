define([ "./Limiter" ], function(Limiter) {
    var getSegment = function(id) {
        if (id >>> 0 >= this._segments.length) {
            throw new RangeError();
        }
        return this._segments[id];
    };
    // allocator passes a method to allocate more memory (with bias toward a particular segment).
    var Unlimited = function(alloc, biasedAlloc) {
        this._alloc = alloc;
        this._biasedAlloc = biasedAlloc;
        this._segments = [];
    };
    Unlimited.prototype.getSegment = getSegment;
    Unlimited.prototype.asLimited = function(maxDepth, maxBytes) {
        return new Limited(this._alloc, this._biasedAlloc, maxDepth, maxBytes);
    };
    var Limited = function(alloc, biasedAlloc, maxDepth, maxBytes) {
        /* No more than 64 chained pointer dereferences by default. */
        this.maxDepth = maxDepth || 64;
        /* No more than 64 MiB of data dereferenced. */
        this.limiter = new Limiter(maxBytes || 67108864);
        this._alloc = alloc;
        this._biasedAlloc = biasedAlloc;
        this._segments = [];
    };
    Limited.prototype.getSegment = getSegment;
    Limited.prototype.asUnlimited = function() {
        return new Unlimited(this._alloc, this._biasedAlloc);
    };
    return {
        Unlimited: Unlimited,
        Limited: Limited
    };
});