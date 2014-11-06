var assert = require('assert');
var Allocator = require('../../node/builder/Allocator');
var alloc = new Allocator();
var layout = require('../../node/reader/layout');
var upgrade = require('../../node/builder/upgrade');
var builder = require('../testing.capnp.d/builders');
var reader = require('../testing.capnp.d/readers');

var sArena = alloc.createArena();

var s = sArena.initRoot(builder.FirstStruct);
var count = 5;
s.initStructList(count);

var ss = s.getStructList();
var t;
t = ss.get(0);
t.setUint16Field(10984);
t.setTextField('asdf');

var u;
u = ss.get(4);
u.setInt16Field(-199);
var u_1 = new Buffer(20); u_1.fill(0);
u_1[1] = 1;
u_1[2] = 2;
u_1[3] = 3;
u_1[4] = 4;
u_1[5] = 5;
u_1[6] = 6;
u_1[7] = 7;
u_1[8] = 8;
u_1[9] = 9;
u.setDataField(u_1);

var dataLength = t.getTextField()._length;
dataLength += dataLength%8 ? (8-dataLength%8) : 0;
dataLength += u_1.length;
dataLength += dataLength%8 ? (8-dataLength%8) : 0;

s.setStructField(s);

var stale = sArena.asReader().getRoot(reader.FirstStruct);

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

describe ('List of upgraded structures', function () {
    describe ('Intrasegment', function () {
        var arena = alloc.createArena(8192*3);
        arena.setRoot(stale);

        var root = arena.getRoot(builder.FirstStruct);
        var p = {
            segment : root._segment,
            position : root._pointersSection + 144
        };

        var first = layout.list.unsafe(arena, p);
        var prior = new Buffer(first.segment._position); prior.fill(0); // More than enough.
        first.segment.copy(prior, 0, first.begin);
        upgrade.list(arena, p, reader.SecondStruct._LIST_CT);
        var second = layout.list.unsafe(arena, p);

        assert.doesNotThrow(function () { arena.getSegment(0); }, RangeError)
        assert.throws(function () { arena.getSegment(1); }, RangeError);

        it ('should contain identical data sections', function () {
            for (var i=0; i<count; ++i) {
                var it1 = {
                    segment : prior,
                    position : i*size(reader.FirstStruct._CT)
                };

                var it2 = {
                    segment : second.segment,
                    position : second.begin + i*size(reader.SecondStruct._CT)
                };

                assert(
                    dataEq(it1, it2, reader.FirstStruct._CT.dataBytes),
                    'data sections misaligned at index ' + i
                );

                // Verify that the remainder is zeroed.
                var diff = reader.SecondStruct._CT.dataBytes - reader.FirstStruct._CT.dataBytes;
                for (var i=0; i<diff; ++i)
                    assert.equal(
                        it2.segment[it2.position+i],
                        0,
                        'Non-null added data fields found at index '+i
                    );
            }
        });

        it ('should contain pointers that dereference identically', function () {
            for (var i=0; i<count; ++i) {
                var it1 = {
                    segment : prior,
                    position : reader.FirstStruct._CT.dataBytes + i*size(reader.FirstStruct._CT)
                };

                var it2 = {
                    segment : second.segment,
                    position : reader.SecondStruct._CT.dataBytes + i*size(reader.SecondStruct._CT)
                };

                assert(
                    pointersEq(arena, it1, it2, reader.FirstStruct._CT.pointersBytes/8),
                    'pointer sections misaligned at index ' + i
                );

                // Verify that the remainder is zeroed.
                var diff = reader.SecondStruct._CT.pointersBytes - reader.FirstStruct._CT.pointersBytes;
                for (var i=0; i<diff; ++i)
                    assert.equal(
                        it2.segment[it2.position+i],
                        0,
                        'Non-null added pointer field(s) found at index ' + i
                    );
            }
        });
    });

    describe ('Intersegment', function () {
        /*
         * Size the arena so that the child struct's list gets allocated on a
         * separate segment.  The separate segment should contain enough space
         * for upgrading everything to one segment.  The precise allocation
         * accounting is as follows:
         * * For an original struct size of `o`, a data+text size of `t`, and a
         *   list count of `k` , the root segment is constructed as
         *   `8+2o+8+ko+t` bytes, leaving a remaining `8+ko+t` for the next
         *   segment.
         * * The second segment then has `32+4o+2ko+2t` bytes.
         * * The second segment needs
         *   - `8+ko+t` bytes for the original content that didn't fit on the
         *     root segment.
         *   - 8 bytes for the root pointer's landing pad,
         *   - and `2u+16+2ku` bytes for tag words and the upgraded struct
         *     bodies.
         * * For this test to remain valid, `u` must satisfy
         *   8+ko+t+8+2u+16+2ku < 32+4o+2ko+2t
         *   => 2u+2ku = 2(k+1)u < 4o+ko+t
         */

        var o = size(reader.FirstStruct._CT);
        var arena = alloc.createArena(16 + 2*o + count*o+dataLength);

        arena.setRoot(stale);
        assert.doesNotThrow(function () { arena.getSegment(1); }, RangeError)
        assert.throws(function () { arena.getSegment(2); }, RangeError);

        var first = layout.structure.unsafe(arena, arena._root());
        first = layout.structure.unsafe(arena, {
            segment : first.segment,
            position : first.pointersSection+16
        });
        var p = {
            segment : first.segment,
            position : first.pointersSection+144
        };
        first = layout.list.unsafe(arena, p)

        var prior = new Buffer(first.segment._position);

        first.segment.copy(prior, 0, first.begin);
        upgrade.list(arena, p, reader.SecondStruct._LIST_CT);
        var second = layout.any.unsafe(arena, p);

        assert.doesNotThrow(function () { arena.getSegment(1); }, RangeError)
        assert.throws(function () { arena.getSegment(2); }, RangeError);

        it ('should contain an identical data section', function () {
            for (var i=0; i<count; ++i) {
                var it1 = {
                    segment : prior,
                    position : i*size(reader.FirstStruct._CT)
                };

                var it2 = {
                    segment : second.segment,
                    position : second.begin + i*size(reader.SecondStruct._CT)
                };

                assert(
                    dataEq(it1, it2, reader.FirstStruct._CT.dataBytes),
                    'data sections misaligned at index ' + i
                );

                // Verify that the remainder is zeroed.
                var diff = reader.SecondStruct._CT.dataBytes - reader.FirstStruct._CT.dataBytes;
                for (var j=0; j<diff; ++j)
                    assert.equal(
                        it2.segment[it2.position+j],
                        0,
                        'Non-null added data field(s) found at index ' + i
                    );
            }
        });

        it ('should contain pointers that dereference identically', function () {
            for (var i=0; i<count; ++i) {
                var it1 = {
                    segment : prior,
                    position : reader.FirstStruct._CT.dataBytes + i*size(reader.FirstStruct._CT)
                };

                var it2 = {
                    segment : second.segment,
                    position : second.begin + reader.SecondStruct._CT.dataBytes + i*size(reader.SecondStruct._CT)
                };

                assert(
                    pointersEq(arena, it1, it2, reader.FirstStruct._CT.pointersBytes/8),
                    'pointer sections misaligned at index ' + i
                );

                // Verify that the remainder is zeroed.
                var diff = reader.SecondStruct._CT.pointersBytes - reader.FirstStruct._CT.pointersBytes;
                for (var j=0; j<diff; ++j)
                    assert.equal(
                        it2.segment[it2.position+j],
                        0,
                        'Non-null added pointer field(s) found at index ' + i + ' ' + j
                    );
            }
        });

        it ('should localize intersegment pointers that become local (free pass)', function () {
            // Free pass since this leverages the same code as structs
        });

        it ('should convert local pointers to far pointers (free pass)', function () {
            // Free pass since this leverages the same code as structs
        });

        /*
         * Due to reuse of the stale version's pointers as landing pads, a
         * double far never arises.
         */
    });
});
