var assert = require('assert');
var Allocator = require('../../node/builder/Allocator');
var alloc = new Allocator();
var layout = require('../../node/reader/layout');
var isNull = require('../../node/reader/isNull');
var upgrade = require('../../node/builder/upgrade');
var builder = require('../testing.capnp.d/builders');
var reader = require('../testing.capnp.d/readers');
var fixture = require('./fixture');

var ramda = require('ramda');

var size = function (ct) {
    return ct.dataBytes + ct.pointersBytes;
};

var sArena = alloc.createArena(5*8192);
var s = sArena.initRoot(builder.FirstStruct);
var first = {};

fixture.inject(s, ramda.omit(['structField'], fixture.first));
first.root = sArena.getSegment(0)._position - 8;
var staleRoot = (function () {
    var arena = alloc.createArena(first.root);
    arena.setRoot(s);
    return arena.asReader().getRoot(reader.SecondStruct);
})();

fixture.inject(s.getStructField(), fixture.first.structField.value);
first.child = sArena.getSegment(0)._position - 8 - first.root;
var staleChild = (function () {
    var arena = alloc.createArena(first.child);
    arena.setRoot(s.getStructField());
    return arena.asReader().getRoot(reader.SecondStruct);
})();

assert.throws(function () { sArena.getSegment(1); }, RangeError);

var fArena = alloc.createArena(5*8192);
var f = fArena.initRoot(builder.SecondStruct);
var second = {};

fixture.inject(f, ramda.omit(['structField'], fixture.second));
second.root = fArena.getSegment(0)._position - 8;

fixture.inject(f.getStructField().getPrior(), fixture.second.structField.value.prior.value);
second.child = fArena.getSegment(0)._position - 8 - second.root;
assert.throws(function () { fArena.getSegment(1); }, RangeError);

var stale = sArena.asReader().getRoot(reader.SecondStruct);

var assertDataEq = function (it1, it2, count) {
    while (count--) {
        assert.strictEqual(
            it1.segment[it1.position],
            it2.segment[it2.position]
        );
        it1.position += 1;
        it2.position += 1;
    }
};

var assertPointersEq = function (arena1, arena2, it1, it2, count) {
    for (var i=0; i<count; ++i, it1.position+=8, it2.position+=8) {
        if (isNull(it1)) {
            assert(isNull(it2));
        } else {
            var ell1 = layout.any.unsafe(arena1, it1);
            var ell2 = layout.any.unsafe(arena2, it2);

            assert.strictEqual(ell1.segment._id, ell2.segment._id);
            delete ell1.segment;
            delete ell2.segment;
            assert.deepEqual(ell1, ell2);
        }
    }
};

/*
 * Due to reuse of the stale version's pointers as landing pads, a double far
 * never arises.
 */

describe ('Upgraded structure pointer', function () {
    describe ('Intrasegment', function () {
        var arena = alloc.createArena(8 + first.root + first.child + size(reader.SecondStruct._CT));
        arena.setRoot(stale);
        var root = arena.getRoot(builder.SecondStruct);

        var parallelArena = alloc.createArena(8 + first.root + first.child + size(reader.SecondStruct._CT));
        parallelArena.setRoot(stale);

        var parallelRoot = parallelArena.asReader().getRoot(reader.FirstStruct);

        assert.throws(function () { arena.getSegment(1); }, RangeError);

        it ('should contain an identical data section', function () {
            var it1 = {
                segment : parallelRoot._segment,
                position : parallelRoot._dataSection
            };

            var it2 = {
                segment : root._segment,
                position : root._dataSection
            };

            assertDataEq(it1, it2, reader.FirstStruct._CT.dataBytes);

            // Verify that the remainder is zeroed.
            var diff = reader.SecondStruct._CT.dataBytes - reader.FirstStruct._CT.dataBytes;
            for (var i=0; i<diff; ++i)
                assert.strictEqual(it2.segment[it2.position+i], 0);
        });

        it ('should contain pointers that dereference identically', function () {
            var it1 = {
                segment : parallelRoot._segment,
                position : parallelRoot._pointersSection
            };

            var it2 = {
                segment : root._segment,
                position : root._pointersSection
            };

            var count = reader.FirstStruct._CT.pointersBytes / 8;
            assertPointersEq(parallelArena, arena, it1, it2, count);

            // Verify that the remainder is zeroed.
            var diff = reader.SecondStruct._CT.pointersBytes - reader.FirstStruct._CT.pointersBytes;
            for (var i=0; i<diff; ++i) {
                assert.strictEqual(it2.segment[it2.position+i], 0);
            }
        });
    });

    describe ('Single Far to Local', function () {
        // Force the child struct's blobs onto segment 1.
        var arena = alloc.createArena(8 + first.root + size(reader.FirstStruct._CT) + size(reader.SecondStruct._CT));
        arena.setRoot(staleRoot);

        // Upgrade (the child's pointers become far pointer landing pads).
        var root = arena.getRoot(builder.SecondStruct);
        assert.throws(function () { arena.getSegment(1); }, RangeError);
        root.getStructField().setPrior(staleChild);
        var child = root.getStructField().getPrior();
        assert.doesNotThrow(function () { arena.getSegment(1); }, RangeError);
        assert.throws(function () { arena.getSegment(2); }, RangeError);

        var parallelArena = alloc.createArena(8 + first.root + size(reader.FirstStruct._CT));
        parallelArena.setRoot(staleRoot);
        parallelArena.getRoot(builder.FirstStruct).setStructField((function () {
            var arena = alloc.createArena();
            arena.setRoot(staleChild);
            return arena.getRoot(builder.FirstStruct);
        })());

        var parallelRoot = parallelArena.asReader().getRoot(reader.FirstStruct);
        var parallelChild = parallelRoot.getStructField();

        it ('should contain an identical data section', function () {
            var it1 = {
                segment : parallelChild._segment,
                position : parallelChild._dataSection
            };

            var it2 = {
                segment : child._segment,
                position : child._dataSection
            };

            assertDataEq(it1, it2, reader.FirstStruct._CT.dataBytes);

            // Verify that the remainder is zeroed.
            var diff = reader.SecondStruct._CT.dataBytes - reader.FirstStruct._CT.dataBytes;
            for (var i=0; i<diff; ++i)
                assert.strictEqual(it2.segment[it2.position+i], 0);
        });

        it ('should contain pointers that dereference identically', function () {
            var it1 = {
                segment : parallelChild._segment,
                position : parallelChild._pointersSection
            };

            var it2 = {
                segment : child._segment,
                position : child._pointersSection
            };

            var count = reader.FirstStruct._CT.pointersBytes / 8;
            assertPointersEq(parallelArena, arena, it1, it2, count);

            // Verify that the remainder is zeroed.
            var diff = reader.SecondStruct._CT.pointersBytes - reader.FirstStruct._CT.pointersBytes;
            for (var i=0; i<diff; ++i) {
                assert.strictEqual(it2.segment[it2.position+i], 0);
            }
        });
    });

    describe ('Local to Single Far', function () {
        /*
         * Force the child struct and its blobs onto segment 1.  Leave no space
         * on segment 0.
         */
        var arena = alloc.createArena(8 + first.root);
        arena.setRoot(stale);
        assert.doesNotThrow(function () { arena.getSegment(1); }, RangeError);
        assert.throws(function () { arena.getSegment(2); }, RangeError);
        arena.getSegment(1)._position = arena.getSegment(1).length;

        // Upgrade (pointers become far pointer landing pads).
        var root = arena.getRoot(builder.SecondStruct);
        var child = root.getStructField().getPrior();

        // Verify that the upgraded structs are not local to their blobs.
        assert.strictEqual(root._segment._id, 2);
        assert.strictEqual(child._segment._id, 2);

        var parallelArena = alloc.createArena(8 + first.root);
        parallelArena.setRoot(stale);

        var parallelRoot = parallelArena.asReader().getRoot(reader.FirstStruct);
        var parallelChild = parallelRoot.getStructField();

        it ('should contain an identical data section', function () {
            var it1 = {
                segment : parallelChild._segment,
                position : parallelChild._dataSection
            };

            var it2 = {
                segment : child._segment,
                position : child._dataSection
            };

            assertDataEq(it1, it2, reader.FirstStruct._CT.dataBytes);

            // Verify that the remainder is zeroed.
            var diff = reader.SecondStruct._CT.dataBytes - reader.FirstStruct._CT.dataBytes;
            for (var i=0; i<diff; ++i)
                assert.strictEqual(it2.segment[it2.position+i], 0);
        });

        it ('should contain pointers that dereference identically', function () {
            var it1 = {
                segment : parallelChild._segment,
                position : parallelChild._pointersSection
            };

            var it2 = {
                segment : child._segment,
                position : child._pointersSection
            };

            var count = reader.FirstStruct._CT.pointersBytes / 8;
            assertPointersEq(parallelArena, arena, it1, it2, count);

            // Verify that the remainder is zeroed.
            var diff = reader.SecondStruct._CT.pointersBytes - reader.FirstStruct._CT.pointersBytes;
            for (var i=0; i<diff; ++i) {
                assert.strictEqual(it2.segment[it2.position+i], 0);
            }
        });
    });

    describe ('Single Far to Single Far', function () {
        /*
         * Size arena to allocate the struct on a different segment than its
         * blobs.
         */
        var arena = alloc.createArena(8 + size(reader.FirstStruct._CT));
        arena.setRoot(stale.getStructField().getPrior());
        var finalSegment = arena.getSegment(arena._segments.length - 1);

        /*
         * Force the struct upgrade onto a lone segment and disallow further
         * allocations on the blobs' segment.
         */
        finalSegment._position = finalSegment.length;

        var root = arena.getRoot(builder.SecondStruct);
        assert.strictEqual(finalSegment._id+1, root._segment._id);

        var parallelArena = alloc.createArena(8 + size(reader.FirstStruct._CT));
        parallelArena.setRoot(stale.getStructField().getPrior());

        var parallelRoot = parallelArena.asReader().getRoot(reader.FirstStruct);

        it ('should contain an identical data section', function () {
            var it1 = {
                segment : parallelRoot._segment,
                position : parallelRoot._dataSection
            };

            var it2 = {
                segment : root._segment,
                position : root._dataSection
            };

            assertDataEq(it1, it2, reader.FirstStruct._CT.dataBytes);

            // Verify that the remainder is zeroed.
            var diff = reader.SecondStruct._CT.dataBytes - reader.FirstStruct._CT.dataBytes;
            for (var i=0; i<diff; ++i)
                assert.strictEqual(it2.segment[it2.position+i], 0);
        });

        it ('should contain double far pointers that dereference identically', function () {
            var it1 = {
                segment : parallelRoot._segment,
                position : parallelRoot._pointersSection
            };

            var it2 = {
                segment : root._segment,
                position : root._pointersSection
            };

            var count = reader.FirstStruct._CT.pointersBytes / 8;

            // Check up to the child pointer
            assertPointersEq(parallelArena, arena, it1, it2, count);

            // Verify that the remainder is zeroed.
            var diff = reader.SecondStruct._CT.pointersBytes - reader.FirstStruct._CT.pointersBytes;
            for (var i=0; i<diff; ++i) {
                assert.strictEqual(it2.segment[it2.position+i], 0);
            }
        });

        it ('should localize pointers that upgrade to the blob\'s segment', function () {
            var i;

            /*
             * Assure that there's enough space on segment 1 for the upgraded
             * struct (and the struct's data).
             */
            var arena = alloc.createArena(8 + 4*(first.root + first.child) + size(reader.FirstStruct._CT));
            for (i=0; i<4; ++i)
                fixture.inject(
                    arena.initOrphan(builder.FirstStruct),
                    fixture.first
                );
            assert.throws(function () { arena.getSegment(1); }, RangeError);
            arena.setRoot(stale);
            assert.strictEqual(
                arena.asReader().getRoot(reader.FirstStruct)._segment._id,
                0
            );

            var root = arena.getRoot(builder.SecondStruct);

            assert.strictEqual(root._segment._id, 1);
            assert.throws(function () { arena.getSegment(2); }, RangeError);

            var parallelArena = alloc.createArena(8 + 4*(first.root + first.child) + size(reader.FirstStruct._CT));
            for (i=0; i<4; ++i)
                fixture.inject(
                    parallelArena.initOrphan(builder.FirstStruct),
                    fixture.first
                );
            parallelArena.setRoot(stale);

            var parallelRoot = parallelArena.asReader().getRoot(reader.FirstStruct);

            var it1 = {
                segment : parallelRoot._segment,
                position : parallelRoot._pointersSection
            };

            var it2 = {
                segment : root._segment,
                position : root._pointersSection
            };

            var count = reader.FirstStruct._CT.pointersBytes / 8;
            for (i=0; i<4; ++i)
                assert.notStrictEqual(it2.segment[it2.position + 8*i] & 3, 2);
            /*
             * Skip list of void--with a blob length of 0, it fit on segment 0,
             * so now it's a far pointer back to segment 0.
             */
            for (i=5; i<count; ++i)
                assert.notStrictEqual(it2.segment[it2.position + 8*i] & 3, 2);

            // Check up to the child pointer
            assertPointersEq(parallelArena, arena, it1, it2, count);

            // Verify that the remainder is zeroed.
            var diff = reader.SecondStruct._CT.pointersBytes - reader.FirstStruct._CT.pointersBytes;
            for (i=0; i<diff; ++i) {
                assert.strictEqual(it2.segment[it2.position+i], 0);
            }
        });
    });

    // Double far pointers remain unaltered.
});
