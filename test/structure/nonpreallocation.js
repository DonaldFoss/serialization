var assert = require('assert');
var Allocator = require('../../node/builder/Allocator');
var alloc = new Allocator();
var far = require('../../node/reader/far');
var builder = require('../../node/builder/layout/structure');
var reader = require('../../node/reader/layout/structure');

var ct = {
    meta : 0,
    dataBytes : 8,
    pointersBytes : 8
};

describe ('Non-preallocated structure pointers', function () {
    describe ('Intrasegment', function () {
        var segment = new Buffer(80);
        segment.fill(0);
        var p = { segment:segment, position:0 };
        var blob = { segment:segment, position:32 };
        var offset = 3;
        builder.nonpreallocated(null, p, blob, ct);

        it ('should get populated according to specification', function() {
            assert.equal(segment[p.position], 0 | (offset<<2));
            assert.equal(segment[p.position+1], offset>>>6);
            assert.equal(segment[p.position+2], offset>>>14);
            assert.equal(segment[p.position+3], offset>>>22);
            assert.equal(segment[p.position+4], ct.dataBytes>>>3);
            assert.equal(segment[p.position+5], ct.dataBytes>>>11);
            assert.equal(segment[p.position+6], ct.pointersBytes>>>3);
            assert.equal(segment[p.position+7], ct.pointersBytes>>>11);
        });

        it ('should parametrize the layout of a blob', function () {
            var layout = reader.intrasegment(p);
            assert.equal(blob.segment, layout.segment);
            assert.equal(ct.meta, layout.meta);
            assert.equal(blob.position, layout.dataSection);
            assert.equal(blob.position + ct.dataBytes, layout.pointersSection);
            assert.equal(blob.position + ct.dataBytes + ct.pointersBytes, layout.end);
        });
    });

    describe ('Single-far intersegment', function () {
        /*
         * Allocate an arena with first segment 8 bytes short of accomodating
         * the type parametrization.  This will force the arena to allocate
         * another segment that will have the excess 8 bytes needed for the
         * landing pad.
         */
        assert(ct.dataBytes + ct.pointersBytes >= 8); // Void structs fit anywhere.
        var arena = alloc.createArena(ct.dataBytes + ct.pointersBytes);

        // Word 0 of segment 0.
        var p = arena._root();

        // Word 0 of segment 1.
        var blob = arena._allocateOrphan(ct.dataBytes + ct.pointersBytes);

        builder.nonpreallocated(arena, p, blob, ct);

        // Intersegment pointer immediate follows the orphan blob
        var offset = (ct.dataBytes + ct.pointersBytes) / 8;

        // Should fit on exactly two segments.
        assert.doesNotThrow(function () { arena.getSegment(1); }, RangeError);
        assert.throws(function () { arena.getSegment(2); }, RangeError);

        it ('should get populated according to specification', function () {
            assert.equal(p.segment[p.position], 2 | (0<<2) | (offset<<3));
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
            assert.equal(land.position, ct.dataBytes+ct.pointersBytes);
        });

        it ('should parametrize the layout of a blob', function () {
            var land = far.next(arena, p);
            var layout = reader.intersegment(land, blob);
            assert.equal(ct.meta, layout.meta);
            assert.equal(blob.segment, layout.segment);
            assert.equal(blob.position, layout.dataSection);
            assert.equal(blob.position+ct.dataBytes, layout.pointersSection);
            assert.equal(blob.position+ct.dataBytes+ct.pointersBytes, layout.end);
        });
    });

    describe ('Double-far intersegment', function () {
        // Void structs fit anywhere.
        assert(ct.dataBytes + ct.pointersBytes >= 8);

        var wordAlignedBytes = ct.dataBytes + ct.pointersBytes;

        assert.equal((wordAlignedBytes >>> 3) % 2, 0);

        /*
         * The blob allocation will require a new segment.  This new segment has
         * sufficient space for the blob alone, no landing pad.
         */
        var arena = alloc.createArena(wordAlignedBytes / 2);

        // Word 0 of segment 0.
        var p = arena._root();

        // Word 0 of segment 1.
        var blob = arena._allocateOrphan(wordAlignedBytes);

        builder.nonpreallocated(arena, p, blob, ct);

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

            assert.equal(tag.segment[tag.position], 0 | 0);
            assert.equal(tag.segment[tag.position+1], 0);
            assert.equal(tag.segment[tag.position+2], 0);
            assert.equal(tag.segment[tag.position+3], 0);
            assert.equal(tag.segment[tag.position+4], ct.dataBytes>>>3);
            assert.equal(tag.segment[tag.position+5], ct.dataBytes>>>11);
            assert.equal(tag.segment[tag.position+6], ct.pointersBytes>>>3);
            assert.equal(tag.segment[tag.position+7], ct.pointersBytes>>>11);
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
            assert.equal(blob.segment, layout.segment);
            assert.equal(blob.position, layout.dataSection);
            assert.equal(blob.position+ct.dataBytes, layout.pointersSection);
            assert.equal(blob.position+ct.dataBytes+ct.pointersBytes, layout.end);
        });
    });
});
