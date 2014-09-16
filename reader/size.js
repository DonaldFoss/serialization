var wordAlign = require('../wordAlign');
var any = require('./layout/any');
var structure = require('./layout/structure');
var list = require('./layout/list');
    var sequence = function(arena, iStart, iEnd) {
        var bytes = 0;
        for (;iStart.position < iEnd.position; iStart += 8) {
            bytes += pointer(arena, iStart);
        }
        return bytes;
    };
    var pointer = function(arena, pointer) {
        var layout = any.safe(arena, pointer);
        var bytes;
        switch (layout.meta) {
          case 0:
            // Locals
            bytes = structure.dataBytes(pointer);
            bytes += structure.pointersBytes(pointer);
            // Follow pointers
            bytes += sequence(arena, layout.pointersSection, layout.end);
            return bytes;

          case 1:
            // Locals
            var size = layout.dataBytes + layout.pointersBytes;
            bytes = wordAlign(layout.length * size);
            var iPointer = {
                segment: layout.segment,
                position: layout.begin + layout.dataBytes
            };
            for (var i = 0; i < layout.length; ++i, iPointer.position += layout.dataBytes) {
                bytes += sequence(arena, iPointer, {
                    segment: iPointer.segment,
                    position: iPointer.position + layout.pointersBytes
                });
            }
            return bytes;
        }
    };
    module.exports = {
        blobs: pointer
    };
