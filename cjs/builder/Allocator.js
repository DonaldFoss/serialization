var Arena = require('./Arena');
    var Allocator = function() {};
    Allocator.allocate = function(bytes) {
        var segment = new Uint8Array(bytes);
        return segment;
    };
    Allocator.prototype.createArena = function(size) {
        return new Builder(Allocator.allocate, size);
    };
    arena.initRoot(Struct);
    arena.getRoot(Struct);
    // Struct.deref(arena, arena.getSegment(0), 0);
    arena.setRoot(readerStructInstanceThatGetsDeepCopied);
    // ?reader.initOrphan(arena); => incorporate as orphan, then arena.adoptRoot(orphan);
    arena.adoptRoot(orphanStructInstance);
    arena.initOrphan(StructOrList);
    Allocator.prototype.initRoot = function(Struct) {
        var arena = this.createArena();
        return arena.initRoot(Struct);
    };
    module.exports = Allocator;
