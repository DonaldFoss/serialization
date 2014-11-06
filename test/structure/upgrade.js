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

var textLength = s.getTextField()._length;
textLength += textLength%8 ? (8-textLength%8) : 0;

s.setStructField(s);

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

describe ('Upgraded structure pointer', function () {
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

            assert(dataEq(it1, it2, reader.FirstStruct._CT.dataBytes));

            // Verify that the remainder is zeroed.
            var diff = reader.SecondStruct._CT.dataBytes - reader.FirstStruct._CT.dataBytes;
            for (var i=0; i<diff; ++i)
                assert.equal(it2.segment[it2.position+i], 0);
        });

        it ('should contain pointers that dereference identically', function () {
            var it1 = {
                segment : prior,
                position : reader.FirstStruct.dataBytes
            };

            var it2 = {
                segment : second.segment,
                position : second.pointersSection
            };

            var count = reader.FirstStruct._CT.dataBytes / 8;
            assert(pointersEq(arena, it1, it2, count));

            // Verify that the remainder is zeroed.
            var diff = reader.SecondStruct._CT.pointersBytes - reader.FirstStruct._CT.pointersBytes;
            for (var i=0; i<diff; ++i) {
                assert.equal(it2.segment[it2.position+i], 0);
            }
        });
    });

    describe ('Intersegment', function () {
        /*
         * Size the arena so that the child struct's text gets allocated on a
         * separate segment.  The separate segment should contain enough space
         * for upgrading everything to one segment.  The precise allocation
         * accounting is as follows:
         * * For an original struct size of `o` and a text size of `t`, the root
         *   segment is constructed as `8+2o+t` bytes, leaving a remaining `t`
         *   for the next segment.
         * * The second segment then has `16+4o+2t` bytes.
         * * The second segment needs
         *   - `t` bytes for the text content of the stale child struct,
         *   - 8 bytes for the root pointer's landing pad,
         *   - and `2u` bytes for the upgraded struct bodies.
         * * For this test to remain valid, `u` must satisfy
         *   t+8+2u < 16+4o+2t
         *   => u < 4+2o+0.5t --word alignment--> 4+2o+floor_8(0.5t)
         *   => u < 4+2o+floor_8(0.5t)
         */

        var arena = alloc.createArena(8 + 2*size(reader.FirstStruct._CT) + textLength);
        arena.setRoot(stale);
        assert.doesNotThrow(function () { arena.getSegment(1); }, RangeError)
        assert.throws(function () { arena.getSegment(2); }, RangeError);

        var first = layout.structure.unsafe(arena, arena._root());

        assert.doesNotThrow(function () { arena.getSegment(1); }, RangeError)
        assert.throws(function () { arena.getSegment(2); }, RangeError);

        var prior = new Buffer(first.end - first.dataSection);
        first.segment.copy(prior, 0, first.dataSection);

        // Upgrade both structs to catch up with child's pointers.
        var root = arena.getRoot(builder.SecondStruct);
        var child = root.getStructField();
        var second = root._layout();

        assert.doesNotThrow(function () { arena.getSegment(1); }, RangeError)
        assert.throws(function () { arena.getSegment(2); }, RangeError);

        it ('should contain an identical data section', function () {
            var it1 = {
                segment : prior,
                position : 0
            };

            var it2 = {
                segment : second.segment,
                position : second.dataSection
            };

            assert(dataEq(it1, it2, reader.FirstStruct._CT.dataBytes));

            // Verify that the remainder is zeroed.
            var diff = reader.SecondStruct._CT.dataBytes - reader.FirstStruct._CT.dataBytes;
            for (var i=0; i<diff; ++i)
                assert.equal(it2.segment[it2.position+i], 0);
        });

        it ('should contain pointers that dereference identically', function () {
            var it1 = {
                segment : prior,
                position : reader.FirstStruct._CT.dataBytes
            };

            var it2 = {
                segment : second.segment,
                position : second.pointersSection
            };

            var count = reader.FirstStruct._CT.dataBytes / 8;
            assert(pointersEq(arena, it1, it2, count));

            // Verify that the remainder is zeroed.
            var diff = reader.SecondStruct._CT.pointersBytes - reader.FirstStruct._CT.pointersBytes;
            for (var i=0; i<diff; ++i) {
                assert.equal(it2.segment[it2.position+i], 0);
            }
        });

        /*
         * As long as the test schema is versioned correctly, this offset (the
         * offset to the text pointer) should never change.
         */
        var offset = 0;
        var ell = child._layout();

        it ('should localize intersegment pointers that become local', function () {
            // In upgraded position, the child's text pointer is local.
            assert.equal(
                ell.segment[ell.pointersSection+offset] & 0x03,
                0x01
            );
        });

        it ('should convert local pointers to far pointers', function () {
            // In upgraded position, the parent's text pointer is now nonlocal.
            assert.equal(
                second.segment[second.pointersSection+offset] & 0x03,
                0x02
            );
        });

        /*
         * Due to reuse of the stale version's pointers as landing pads, a
         * double far never arises.
         */
    });
});
