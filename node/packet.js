var Arena = require('./reader/Arena');
var Allocator = require('./builder/Allocator');
var deep = require('./builder/copy/deep');
    var allocator = new Allocator();
    var fromStruct = function(instance) {
        var arena = instance._arena;
        var singleton;
        if (arena._segments.length !== 1) {
            // Compute upper bound on necessary arena size:
            // * Single hop far pointer implies 8 bytes of slop.
            // * Double hop far pointer implies 16 bytes of slop.
            var size = 0;
            arena._segments.forEach(function(s) {
                size += s._position;
            });
            var packetArena = allocator.createArena(size);
            deep.setStructurePointer(arena, instance._layout(), packetArena, packetArena._root());
            singleton = packetArena.getSegment(0);
        } else {
            singleton = arena.getSegment(0);
        }
        return singleton.slice(0, singleton._position);
    };
    var toArena = function(blob) {
        return new Arena([ blob ]);
    };
    module.exports = {
        fromStruct: fromStruct,
        toArena: toArena
    };
