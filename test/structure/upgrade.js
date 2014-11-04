var assert = require('assert');
var Allocator = require('../../node/builder/Allocator');
var alloc = new Allocator();
var layout = require('../../node/reader/layout');
var upgrade = require('../../node/builder/upgrade');
var builder = require('../testing.capnp.d/builders');
var reader = require('../testing.capnp.d/readers');

var sArena = alloc.createArena();

var s = sArena.initRoot(builder.FirstStruct);
s.setUint16Field(107);
s.setTextField('asdf');
s.setStructField(s);

var ell = s.initUint8List(39);
ell.set(3,16);
ell.set(31,12);

var stale = sArena.asReader().getRoot(reader.SecondStruct);

var size = function (ct) {
    return ct.dataBytes + ct.pointersBytes;
};

var dataEq = function (it1, it2, count) {
    while (count--) {
        if (it1.segment[it1.position] !== it2.segment[it2.position]) return false;
        it1.position += 1;
        it2.position += 1;
    }

    return true;
};

var pointersEq = function (arena, it1, it2, count) {
    for (var i=0; i<count; ++i, it1.position+=8, it2.position+=8) {
        var ell1 = layout.any.unsafe(arena, it1);
        var ell2 = layout.any.unsafe(arena, it2);
        for (var k in Object.keys(ell1))
            if (ell1[k] !== ell2[k]) return false;
    }

    return true;
};

describe ('Upgraded structure pointers', function () {
    describe ('Intrasegment', function () {
        var arena = alloc.createArena();
        arena.setRoot(stale);
        var first = layout.structure.unsafe(arena, arena._root());
        var prior = new Buffer(first.end - first.dataSection);
        first.segment.copy(prior, 0, first.dataSection);
        upgrade.structure(arena, arena._root(), reader.SecondStruct._CT);
        var second = layout.structure.unsafe(arena, arena._root());

        it ('should contain an identical data section', function () {
            var it1 = {
                segment : prior,
                position : 0
            };

            var it2 = {
                segment : second.segment,
                position : second.dataSection
            };

            assert(dataEq(it1, it2, first.pointersSection-first.dataSection));

            // Verify that the remainder is zeroed.
            var diff = reader.SecondStruct._CT.dataBytes - reader.FirstStruct._CT.dataBytes;
            for (var i=0; i<diff; ++i)
                assert.equal(it2.segment[it2.position+i], 0);
        });

        it ('should contain pointers that dereference identically', function () {
            var it1 = {
                segment : first.segment,
                position : first.pointersSection
            };

            var it2 = {
                segment : second.segment,
                position : second.pointersSection
            };

            var count = (first.end-first.pointersSection) / 8;
            assert(pointersEq(arena, it1, it2, count));

            // Verify that the remainder is zeroed.
            var diff = reader.SecondStruct._CT.pointersBytes - reader.FirstStruct._CT.pointersBytes;
            for (var i=0; i<diff; ++i) {
                assert.equal(it2.segment[it2.position+i], 0);
            }
        });
    });

    /*
     * Size the arena so that the text gets allocated on a separate segment.
         * The separate segment should contain enough space for the upgraded
         * struct.  The precise allocation accounting is as follows:
         * * For an original struct size of `o`, the root segment has `8+o`
         *   bytes.
         * * The second segment then has `16+2o` bytes.
         * * Besides the upgraded struct, the second segment needs
         *   - `t` bytes for the text content,
         *   - 8 bytes for the root pointer's landing pad,
         *   - and `u` bytes for the upgraded struct's body.
         * * For this test to remain valid, `u` must remain at or below
         *   t+8+u < 16+2o => u < 8+2o-t.
         * * Generalizing the original struct to contain more than just the one
         *   bit of text data, substitute the sum of their bytes for `t`.
         */




    describe ('Intersegment', function () {
        var arena = alloc.createArena(8+size(reader.FirstStruct._CT));
        arena.setRoot(stale);
        var first = layout.structure.unsafe(arena, arena._root());
        var prior = new Buffer(first.end - first.dataSection);
        first.segment.copy(prior, 0, first.dataSection);
        upgrade.structure(arena, arena._root(), reader.SecondStruct._CT);
        var second = layout.structure.unsafe(arena, arena._root());

        it ('should contain an identical data section', function () {
            var it1 = {
                segment : prior,
                position : 0
            };

            var it2 = {
                segment : second.segment,
                position : second.dataSection
            };

            assert(dataEq(it1, it2, first.pointersSection-first.dataSection));

            // Verify that the remainder is zeroed.
            var diff = reader.SecondStruct._CT.dataBytes - reader.FirstStruct._CT.dataBytes;
            for (var i=0; i<diff; ++i)
                assert.equal(it2.segment[it2.position+i], 0);
        });

        it ('should contain pointers that dereference identically', function () {
            var it1 = {
                segment : first.segment,
                position : first.pointersSection
            };

            var it2 = {
                segment : second.segment,
                position : second.pointersSection
            };

            var count = (first.end-first.pointersSection) / 8;
            assert(pointersEq(arena, it1, it2, count));

            // Verify that the remainder is zeroed.
            var diff = reader.SecondStruct._CT.pointersBytes - reader.FirstStruct._CT.pointersBytes;
            for (var i=0; i<diff; ++i) {
                assert.equal(it2.segment[it2.position+i], 0);
            }
        });

        it ('should contain intrasegment pointers when possible', function () {
            /*
             * As long as the test schema is versioned correctly, this offset
             * (the offset to the text pointer) should never change.
             */
            var offset = 0;

            // In upgraded position, the text pointer is now local.
            assert.equal(
                second.segment[second.pointersSection+offset]&0x03,
                0x01
            );
        });
    });

    describe ('Intersegment', function () {
        var arena = alloc.createArena(16+size(reader.FirstStruct._CT));
        arena.setRoot(stale);
        var first = layout.structure.unsafe(arena, arena._root());
        var prior = new Buffer(first.end - first.dataSection);
        first.segment.copy(prior, 0, first.dataSection);
        upgrade.structure(arena, arena._root(), reader.SecondStruct._CT);
        var second = layout.structure.unsafe(arena, arena._root());

        it ('should contain an identical data section', function () {
            var it1 = {
                segment : prior,
                position : 0
            };

            var it2 = {
                segment : second.segment,
                position : second.dataSection
            };

            assert(dataEq(it1, it2, first.pointersSection-first.dataSection));

            // Verify that the remainder is zeroed.
            var diff = reader.SecondStruct._CT.dataBytes - reader.FirstStruct._CT.dataBytes;
            for (var i=0; i<diff; ++i)
                assert.equal(it2.segment[it2.position+i], 0);
        });

        it ('should contain pointers that dereference identically', function () {
            var it1 = {
                segment : first.segment,
                position : first.pointersSection
            };

            var it2 = {
                segment : second.segment,
                position : second.pointersSection
            };

            var count = (first.end-first.pointersSection) / 8;
            assert(pointersEq(arena, it1, it2, count));

            // Verify that the remainder is zeroed.
            var diff = reader.SecondStruct._CT.pointersBytes - reader.FirstStruct._CT.pointersBytes;
            for (var i=0; i<diff; ++i) {
                assert.equal(it2.segment[it2.position+i], 0);
            }
        });

        it ('should contain intrasegment pointers when possible', function () {
            /*
             * As long as the test schema is versioned correctly, this offset
             * (the offset to the text pointer) should never change.
             */
            var offset = 0;

            // In upgraded position, the text pointer is now local.
            assert.equal(
                second.segment[second.pointersSection+offset]&0x03,
                0x01
            );
        });
    });

    describe ('Intersegment', function () {
console.log('INTER');
        var arena = alloc.createArena(size(reader.FirstStruct._CT));
        arena.setRoot(stale);
        var first = layout.structure.unsafe(arena, arena._root());
        var prior = new Buffer(first.end - first.dataSection);
        first.segment.copy(prior, 0, first.dataSection);
        upgrade.structure(arena, arena._root(), reader.SecondStruct._CT);
        var second = layout.structure.unsafe(arena, arena._root());

        it ('should contain an identical data section', function () {
            var it1 = {
                segment : prior,
                position : 0
            };

            var it2 = {
                segment : second.segment,
                position : second.dataSection
            };

            assert(dataEq(it1, it2, first.pointersSection-first.dataSection));

            // Verify that the remainder is zeroed.
            var diff = reader.SecondStruct._CT.dataBytes - reader.FirstStruct._CT.dataBytes;
            for (var i=0; i<diff; ++i)
                assert.equal(it2.segment[it2.position+i], 0);
        });

        it ('should contain pointers that dereference identically', function () {
            var it1 = {
                segment : first.segment,
                position : first.pointersSection
            };

            var it2 = {
                segment : second.segment,
                position : second.pointersSection
            };

            var count = (first.end-first.pointersSection) / 8;
            assert(pointersEq(arena, it1, it2, count));

            // Verify that the remainder is zeroed.
            var diff = reader.SecondStruct._CT.pointersBytes - reader.FirstStruct._CT.pointersBytes;
            for (var i=0; i<diff; ++i) {
                assert.equal(it2.segment[it2.position+i], 0);
            }
        });

        it ('should contain intrasegment pointers when possible', function () {
            /*
             * As long as the test schema is versioned correctly, this offset
             * (the offset to the text pointer) should never change.
             */
            var offset = 0;

            // In upgraded position, the text pointer is now local.
            assert.equal(
                second.segment[second.pointersSection+offset]&0x03,
                0x01
            );
        });
    });
});
