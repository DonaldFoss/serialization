define([ "../reader/Arena" ], function(Reader) {
    // allocator passes a method to allocate more memory (with bias toward a particular segment).
    var Builder = function(alloc, biasedAlloc) {
        this._alloc = alloc;
        this._biasedAlloc = biasedAlloc;
        this._segments = [];
    };
    Builder.prototype.getSegment = Reader.prototype.getSegment;
    Builder.prototype.asReader = function(maxDepth, maxBytes) {
        return new Reader(this._segments, maxDepth, maxBytes);
    };
    return Builder;
});