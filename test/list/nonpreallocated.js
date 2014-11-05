var assert = require('assert');
var Allocator = require('../../node/builder/Allocator');
var alloc = new Allocator();
var far = require('../../node/reader/far');
var builder = require('../../node/builder/layout/list');
var reader = require('../../node/reader/layout/list');

var ct = {
    meta : 1,
    layout : 4,
    dataBytes : 4,
    pointersBytes : 0
};

var rt = {
    meta : 1,
    layout : 7,
    dataBytes : 8,
    pointersBytes : 16,
};

describe ('Non-preallocated list pointers', function () {
    describe ('Non-inline-composite', function () {
        describe ('Intrasegment', function () {
            var segment = new Buffer(80);
            segment.fill(0);
            var p = { segment:segment, position:0 };
            var blob = { segment:segment, position:32 };
            var offset = 3;
            var length = 5;
            builder.nonpreallocated(null, p, blob, ct, length);

            it ('should get populated according to specification', function() {
                assert.equal(segment[p.position], 1 | offset<<2);
                assert.equal(segment[p.position+1], offset>>>6);
                assert.equal(segment[p.position+2], offset>>>14);
                assert.equal(segment[p.position+3], offset>>>22);
                assert.equal(segment[p.position+4], ct.layout | (length<<3));
                assert.equal(segment[p.position+5], length>>>5);
                assert.equal(segment[p.position+6], length>>>13);
                assert.equal(segment[p.position+7], length>>>21);
            });

            it ('should point at a tagless blob', function () {
                assert.equal(segment[blob.position], 0);
                assert.equal(segment[blob.position+1], 0);
                assert.equal(segment[blob.position+2], 0);
                assert.equal(segment[blob.position+3], 0);
                assert.equal(segment[blob.position+4], 0);
                assert.equal(segment[blob.position+5], 0);
                assert.equal(segment[blob.position+6], 0);
                assert.equal(segment[blob.position+7], 0);
            });

            it ('should parametrize the layout of a blob', function () {
                var layout = reader.intrasegment(p);
                assert.equal(ct.meta, layout.meta);
                assert.equal(ct.dataBytes, layout.dataBytes);
                assert.equal(ct.pointersBytes, layout.pointersBytes);
                assert.equal(length, layout.length);
                assert.equal(blob.position, layout.begin);
                assert.equal(blob.segment, layout.segment);
            });
        });

        describe ('Single-far intersegment', function () {
            var length = 5;

            /*
             * Allocate an arena with its first segment 8 bytes short of
             * accomodating the type parametrization.  This will force the arena
             * to allocate another segment that will have the excess 8 bytes
             * needed for the landing pad.
             */
            assert((ct.dataBytes + ct.pointersBytes)*length >= 8);
            var wordAlignedBytes = (ct.dataBytes + ct.pointersBytes)*length;
            var rem = wordAlignedBytes % 8;
            wordAlignedBytes += rem ? (8-rem) : 0;
            var arena = alloc.createArena(wordAlignedBytes);

            // Word 0 of segment 0.
            var p = arena._root();

            // Word 0 of segment 1.
            var blob = arena._allocateOrphan(wordAlignedBytes);

            builder.nonpreallocated(arena, p, blob, ct, length);

            // Intersegment pointer immediate follows the orphan blob
            var offset = wordAlignedBytes / 8;

            // Should fit on exactly two segments.
            assert.doesNotThrow(function () { arena.getSegment(1); }, RangeError);
            assert.throws(function () { arena.getSegment(2); }, RangeError);

            it ('should get populated according to specification', function () {
                assert.equal(p.segment[p.position], 2 | 0<<2 | offset<<3);
                assert.equal(p.segment[p.position+1], offset>>>5);
                assert.equal(p.segment[p.position+2], offset>>>13);
                assert.equal(p.segment[p.position+3], offset>>>21);
                assert.equal(p.segment[p.position+4], 1);
                assert.equal(p.segment[p.position+5], 0);
                assert.equal(p.segment[p.position+6], 0);
                assert.equal(p.segment[p.position+7], 0);
            });

            it ('should point at an offsegment, intrasegment pointer', function () {
                var land = far.next(arena, p);
                assert.equal(land.segment, arena.getSegment(1));
                assert.equal(land.position, wordAlignedBytes);
            });

            it ('should parametrize the layout of a blob', function () {
                var land = far.next(arena, p);
                var layout = reader.intersegment(land, blob);
                assert.equal(ct.meta, layout.meta);
                assert.equal(ct.dataBytes, layout.dataBytes);
                assert.equal(ct.pointersBytes, layout.pointersBytes);
                assert.equal(length, layout.length);
                assert.equal(blob.position, layout.begin);
                assert.equal(blob.segment, layout.segment);
            });
        });

        describe ('Double-far intersegment', function () {
            var length = 4;

            // Void lists fit anywhere.
            assert((ct.dataBytes + ct.pointersBytes)*length >= 8);

            assert.notEqual(ct.layout, 0x07);
            var wordAlignedBytes = (ct.dataBytes + ct.pointersBytes) * length;
            var rem = wordAlignedBytes % 8;
            wordAlignedBytes += rem ? (8-rem) : 0;
            assert.equal((wordAlignedBytes>>>3) % 2, 0);

            /*
             * The blob allocation will require a new segment.  This new segment
             * has sufficient space for the blob alone, no landing pad.
             */
            var arena = alloc.createArena(wordAlignedBytes / 2);

            // Word 0 of segment 0.
            var p = arena._root();

            // Word 0 of segment 1.
            var blob = arena._allocateOrphan(wordAlignedBytes);

            builder.nonpreallocated(arena, p, blob, ct, length);

            // Should fit on exactly three segments.
            assert.doesNotThrow(function () { arena.getSegment(2); }, RangeError);
            assert.throws(function () { arena.getSegment(3); }, RangeError);

            it ('should get populated according to specification', function () {
                assert.equal(p.segment[p.position], 2 | 1<<2 | 0<<3);
                assert.equal(p.segment[p.position+1], 0>>>5);
                assert.equal(p.segment[p.position+2], 0>>>13);
                assert.equal(p.segment[p.position+3], 0>>>21);
                assert.equal(p.segment[p.position+4], 2);
                assert.equal(p.segment[p.position+5], 0);
                assert.equal(p.segment[p.position+6], 0);
                assert.equal(p.segment[p.position+7], 0);
            });

            it ('should point at a landing pad with its pointer populated according to specification', function () {
                var land = far.next(arena, p);
                assert.equal(land.segment, arena.getSegment(2));
                assert.equal(land.position, 0);

                assert.equal(land.segment[land.position], 2 | 0<<2 | 0<<3);
                assert.equal(land.segment[land.position+1], 0>>>5);
                assert.equal(land.segment[land.position+2], 0>>>13);
                assert.equal(land.segment[land.position+3], 0>>>21);
                assert.equal(land.segment[land.position+4], 1);
                assert.equal(land.segment[land.position+5], 0);
                assert.equal(land.segment[land.position+6], 0);
                assert.equal(land.segment[land.position+7], 0);
            });

            it ('should point at a landing pad with its tag populated according to specification', function () {
                var land = far.next(arena, p);
                assert.equal(land.segment, arena.getSegment(2));
                assert.equal(land.position, 0);
                var tag = {
                    segment : land.segment,
                    position : land.position+8
                };

                assert.equal(tag.segment[tag.position], 1 | 0<<2);
                assert.equal(tag.segment[tag.position+1], 0>>>6);
                assert.equal(tag.segment[tag.position+2], 0>>>14);
                assert.equal(tag.segment[tag.position+3], 0>>>22);
                assert.equal(tag.segment[tag.position+4], ct.layout | (length<<3));
                assert.equal(tag.segment[tag.position+5], length>>>5);
                assert.equal(tag.segment[tag.position+6], length>>>13);
                assert.equal(tag.segment[tag.position+7], length>>>21);
            });

            it ('should parametrize the layout of a blob', function () {
                var land = far.next(arena, p);
                assert.equal(land.segment, arena.getSegment(2));
                assert.equal(land.position, 0);
                var tag = {
                    segment : land.segment,
                    position : land.position+8
                };

                var layout = reader.intersegment(tag, blob);
                assert.equal(ct.meta, layout.meta);
                assert.equal(ct.dataBytes, layout.dataBytes);
                assert.equal(ct.pointersBytes, layout.pointersBytes);
                assert.equal(length, layout.length);
                assert.equal(blob.position, layout.begin);
                assert.equal(blob.segment, layout.segment);
            });
        });
    });

    describe ('Inline-composite', function () {
        describe ('Intrasegment', function () {
            var segment = new Buffer(80);
            segment.fill(0);
            var p = { segment:segment, position:0 };
            var blob = { segment:segment, position:32 };
            var offset = 3;
            var length = 5;
            builder.nonpreallocated(null, p, blob, rt, length);

            var wordAlignedBytes = length * (rt.dataBytes + rt.pointersBytes);

            it ('should get populated according to specification', function() {
                assert.equal(segment[p.position], 1 | offset<<2);
                assert.equal(segment[p.position+1], offset>>>6);
                assert.equal(segment[p.position+2], offset>>>14);
                assert.equal(segment[p.position+3], offset>>>22);
                assert.equal(segment[p.position+4], rt.layout | wordAlignedBytes);
                assert.equal(segment[p.position+5], wordAlignedBytes>>>8);
                assert.equal(segment[p.position+6], wordAlignedBytes>>>16);
                assert.equal(segment[p.position+7], wordAlignedBytes>>>24);
            });

            it ('should point at a tagged blob', function () {
                assert.equal(segment[blob.position], length<<2);
                assert.equal(segment[blob.position+1], length>>>6);
                assert.equal(segment[blob.position+2], length>>>14);
                assert.equal(segment[blob.position+3], length>>>22);
                assert.equal(segment[blob.position+4], rt.dataBytes>>>3);
                assert.equal(segment[blob.position+5], rt.dataBytes>>>11);
                assert.equal(segment[blob.position+6], rt.pointersBytes>>>3);
                assert.equal(segment[blob.position+7], rt.pointersBytes>>>11);
            });

            it ('should parametrize the layout of a blob', function () {
                var layout = reader.intrasegment(p);
                assert.equal(rt.meta, layout.meta);
                assert.equal(rt.dataBytes, layout.dataBytes);
                assert.equal(rt.pointersBytes, layout.pointersBytes);
                assert.equal(length, layout.length);
                assert.equal(blob.position+8, layout.begin);
                assert.equal(blob.segment, layout.segment);
            });
        });

        describe ('Single-far intersegment', function () {
            var length = 5;

            /*
             * Allocate an arena with its first segment 8 bytes short of
             * accomodating the type parametrization.  This will force the arena
             * to allocate another segment that will have the excess 8 bytes
             * needed for the landing pad.
             */
            assert((rt.dataBytes + rt.pointersBytes)*length >= 8);
            var wordAlignedBytes = (rt.dataBytes + rt.pointersBytes)*length;
            var rem = wordAlignedBytes % 8;
            wordAlignedBytes += rem ? (8-rem) : 0;
            var arena = alloc.createArena(wordAlignedBytes);

            // Word 0 of segment 0.
            var p = arena._root();

            // Word 0 of segment 1.
            var blob = arena._allocateOrphan(wordAlignedBytes);

            builder.nonpreallocated(arena, p, blob, rt, length);

            // Intersegment pointer immediate follows the orphan blob
            var offset = wordAlignedBytes / 8;

            // Should fit on exactly two segments.
            assert.doesNotThrow(function () { arena.getSegment(1); }, RangeError);
            assert.throws(function () { arena.getSegment(2); }, RangeError);

            it ('should get populated according to specification', function () {
                assert.equal(p.segment[p.position], 2 | 0<<2 | offset<<3);
                assert.equal(p.segment[p.position+1], offset>>>5);
                assert.equal(p.segment[p.position+2], offset>>>13);
                assert.equal(p.segment[p.position+3], offset>>>21);
                assert.equal(p.segment[p.position+4], 1);
                assert.equal(p.segment[p.position+5], 0);
                assert.equal(p.segment[p.position+6], 0);
                assert.equal(p.segment[p.position+7], 0);
            });

            it ('should point at an offsegment, intrasegment pointer', function () {
                var land = far.next(arena, p);
                assert.equal(land.segment, arena.getSegment(1));
                assert.equal(land.position, wordAlignedBytes);
            });

            it ('should parametrize the layout of a blob', function () {
                var land = far.next(arena, p);
                var layout = reader.intersegment(land, blob);
                assert.equal(rt.meta, layout.meta);
                assert.equal(rt.dataBytes, layout.dataBytes);
                assert.equal(rt.pointersBytes, layout.pointersBytes);
                assert.equal(length, layout.length);
                assert.equal(blob.position+8, layout.begin);
                assert.equal(blob.segment, layout.segment);
            });
        });

        describe ('Double-far intersegment', function () {
            var length = 5;

            // Void lists fit anywhere.
            assert((rt.dataBytes + rt.pointersBytes)*length >= 8);

            var wordAlignedBytes = (rt.dataBytes + rt.pointersBytes) * length;

            // Leave no space for a hop point.
            var arena = alloc.createArena(8);

            // Word 0 of segment 0.
            var p = arena._root();

            // Word 0 of segment 1.
            var blob = arena._allocateOrphan(8 + wordAlignedBytes);

            builder.nonpreallocated(arena, p, blob, rt, length);

            // Should fit on exactly three segments.
            assert.doesNotThrow(function () { arena.getSegment(2); }, RangeError);
            assert.throws(function () { arena.getSegment(3); }, RangeError);

            it ('should get populated according to specification', function () {
                assert.equal(p.segment[p.position], 2 | 1<<2 | 0<<3);
                assert.equal(p.segment[p.position+1], 0>>>5);
                assert.equal(p.segment[p.position+2], 0>>>13);
                assert.equal(p.segment[p.position+3], 0>>>21);
                assert.equal(p.segment[p.position+4], 2);
                assert.equal(p.segment[p.position+5], 0);
                assert.equal(p.segment[p.position+6], 0);
                assert.equal(p.segment[p.position+7], 0);
            });

            it ('should point at a landing pad with its pointer populated according to specification', function () {
                var land = far.next(arena, p);
                assert.equal(land.segment, arena.getSegment(2));
                assert.equal(land.position, 0);

                assert.equal(land.segment[land.position], 2 | 0<<2 | 0<<3);
                assert.equal(land.segment[land.position+1], 0>>>5);
                assert.equal(land.segment[land.position+2], 0>>>13);
                assert.equal(land.segment[land.position+3], 0>>>21);
                assert.equal(land.segment[land.position+4], 1);
                assert.equal(land.segment[land.position+5], 0);
                assert.equal(land.segment[land.position+6], 0);
                assert.equal(land.segment[land.position+7], 0);
            });

            it ('should point at a landing pad with its tag populated according to specification', function () {
                var land = far.next(arena, p);
                assert.equal(land.segment, arena.getSegment(2));
                assert.equal(land.position, 0);
                var tag = {
                    segment : land.segment,
                    position : land.position+8
                };

                assert.equal(tag.segment[tag.position], 1 | 0);
                assert.equal(tag.segment[tag.position+1], 0);
                assert.equal(tag.segment[tag.position+2], 0);
                assert.equal(tag.segment[tag.position+3], 0);
                assert.equal(tag.segment[tag.position+4], rt.layout | wordAlignedBytes);
                assert.equal(tag.segment[tag.position+5], wordAlignedBytes>>>8);
                assert.equal(tag.segment[tag.position+6], wordAlignedBytes>>>16);
                assert.equal(tag.segment[tag.position+7], wordAlignedBytes>>>24);
            });

            it ('should parametrize the layout of a blob', function () {
                var land = far.next(arena, p);
                assert.equal(land.segment, arena.getSegment(2));
                assert.equal(land.position, 0);
                var tag = {
                    segment : land.segment,
                    position : land.position+8
                };

                var layout = reader.intersegment(tag, blob);
                assert.equal(rt.meta, layout.meta);
                assert.equal(rt.dataBytes, layout.dataBytes);
                assert.equal(rt.pointersBytes, layout.pointersBytes);
                assert.equal(length, layout.length);
                assert.equal(blob.position+8, layout.begin);
                assert.equal(blob.segment, layout.segment);
            });
        });
    });
});
