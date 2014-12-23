var assert = require('assert');
var Allocator = require('../../node/builder/Allocator');
var alloc = new Allocator();
var layout = require('../../node/reader/layout');
var isNull = require('../../node/reader/isNull');
var upgrade = require('../../node/builder/upgrade');
var builder = require('../testing.capnp.d/builders');
var reader = require('../testing.capnp.d/readers');
var fixture = require('../structure/fixture');

var ramda = require('ramda');

var size = function (ct) {
    return ct.dataBytes + ct.pointersBytes;
};

var s;

var rootArena = alloc.createArena(5*8192);
s = rootArena.initRoot(builder.FirstStruct);
fixture.inject(s, ramda.omit(['structField'], fixture.first));
var first = {};

fixture.inject(s, ramda.omit(['structField'], fixture.first));
assert.throws(function () { rootArena.getSegment(1); }, RangeError);
first.root = rootArena.getSegment(0)._position - 8;
var staleRoot = rootArena.asReader().getRoot(reader.SecondStruct);

var listArena = alloc.createArena(5*8192);
listArena.setRoot(staleRoot);
s = listArena.getRoot(builder.FirstStruct);
var ell = s.initStructList(2);
fixture.inject(ell.get(0), fixture.first);
fixture.inject(ell.get(1), fixture.first.structField.value);
assert.throws(function () { listArena.getSegment(1); }, RangeError);
first.list = listArena.getSegment(0)._position - first.root - 8;
var staleList = listArena.asReader().getRoot(reader.SecondStruct).getStructList().getPrior();

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

describe ('List of upgraded structures', function () {
    describe ('Intrasegment', function () {
        var arena = alloc.createArena(8 + first.root + first.list + 8 + (1+2)*size(reader.SecondStruct._CT));
        arena.setRoot(staleRoot);
        arena.getRoot(builder.FirstStruct).setStructList(
            listArena.asReader().getRoot(reader.FirstStruct).getStructList()
        );
        var root = arena.getRoot(builder.SecondStruct); // Upgrade root
        var list = root.getStructList().getPrior(); // Upgrade list

        var parallelArena = alloc.createArena(8 + first.root + first.list);
        parallelArena.setRoot(staleRoot);
        parallelArena.getRoot(builder.FirstStruct).setStructList(
            listArena.asReader().getRoot(reader.FirstStruct).getStructList()
        );
        var parallelRoot = parallelArena.asReader().getRoot(reader.FirstStruct);
        var parallelList = parallelRoot.getStructList();

        assert.throws(function () { arena.getSegment(1); }, RangeError);
        assert.throws(function () { parallelArena.getSegment(1); }, RangeError);

        it ('should contain identical data sections', function () {
            for (var i=0; i<2; ++i) {
                var it1 = {
                    segment : parallelList._segment,
                    position : parallelList._begin
                        + i*size(reader.FirstStruct._CT)
                };

                var it2 = {
                    segment : list._segment,
                    position : list._begin
                        + i*size(reader.SecondStruct._CT)
                };

                assertDataEq(it1, it2, reader.FirstStruct._CT.dataBytes);

                // Verify that the remainder is zeroed.
                var diff = reader.SecondStruct._CT.dataBytes - reader.FirstStruct._CT.dataBytes;
                for (var j=0; j<diff; ++j)
                    assert.strictEqual(it2.segment[it2.position+j], 0);
            }
        });

        it ('should contain pointers that dereference identically', function () {
            for (var i=0; i<2; ++i) {
                var it1 = {
                    segment : parallelList._segment,
                    position : parallelList._begin
                        + reader.FirstStruct._CT.dataBytes
                        + i*size(reader.FirstStruct._CT)
                };

                var it2 = {
                    segment : list._segment,
                    position : list._begin
                        + reader.SecondStruct._CT.dataBytes
                        + i*size(reader.SecondStruct._CT)
                };

                assertPointersEq(
                    parallelArena, arena,
                    it1, it2,
                    reader.FirstStruct._CT.pointersBytes / 8
                );

                // Verify that the remainder is zeroed.
                var diff = reader.SecondStruct._CT.pointersBytes - reader.FirstStruct._CT.pointersBytes;
                for (var j=0; j<diff; ++j)
                    assert.strictEqual(it2.segment[it2.position+j], 0);
            }
        });
    });

    describe ('Single Far to Local', function () {
        // Force list's blobs onto segment 1.
        var arena = alloc.createArena(8 + first.root + 8 + size(reader.SecondStruct._CT) + 2*size(reader.FirstStruct._CT));
        arena.setRoot(staleRoot);
        var root = arena.getRoot(builder.SecondStruct); // Upgrade root
        root.getStructList().setPrior(staleList);
        assert.doesNotThrow(function () { arena.getSegment(1); }, RangeError);
        assert.throws(function () { arena.getSegment(2); }, RangeError);

        var list = root.getStructList().getPrior(); // Upgrade list

        var parallelArena = alloc.createArena(8 + first.root + 8 + size(reader.SecondStruct._CT) + 2*size(reader.FirstStruct._CT));
        parallelArena.setRoot(staleRoot);
        parallelArena.getRoot(builder.SecondStruct).getStructList().setPrior(staleList);

        var parallelRoot = parallelArena.asReader().getRoot(reader.FirstStruct);
        var parallelList = parallelRoot.getStructList();

        it ('should contain an identical data section', function () {
            for (var i=0; i<2; ++i) {
                var it1 = {
                    segment : parallelList._segment,
                    position : parallelList._begin
                        + i*size(reader.FirstStruct._CT)
                };

                var it2 = {
                    segment : list._segment,
                    position : list._begin
                        + i*size(reader.SecondStruct._CT)
                };

                assertDataEq(it1, it2, reader.FirstStruct._CT.dataBytes);

                // Verify that the remainder is zeroed.
                var diff = reader.SecondStruct._CT.dataBytes - reader.FirstStruct._CT.dataBytes;
                for (var j=0; j<diff; ++j)
                    assert.strictEqual(it2.segment[it2.position+i], 0);
            }
        });

        it ('should contain pointers that dereference identically', function () {
            for (var i=0; i<2; ++i) {
                var it1 = {
                    segment : parallelList._segment,
                    position : parallelList._begin
                        + reader.FirstStruct._CT.dataBytes
                        + i*size(reader.FirstStruct._CT)
                };

                var it2 = {
                    segment : list._segment,
                    position : list._begin
                        + reader.SecondStruct._CT.dataBytes
                        + i*size(reader.SecondStruct._CT)
                };

                assertPointersEq(
                    parallelArena, arena,
                    it1, it2,
                    reader.FirstStruct._CT.pointersBytes / 8
                );

                // Verify that the remainder is zeroed.
                var diff = reader.SecondStruct._CT.pointersBytes - reader.FirstStruct._CT.pointersBytes;
                for (var j=0; j<diff; ++j)
                    assert.strictEqual(it2.segment[it2.position+j], 0);
            }
        });
    });

    describe ('Local to Single Far', function () {
        /*
         * Force the list and its blobs onto segment 1.  Leave no space on
         * segment 0.
         */
        var arena = alloc.createArena(8 + first.root + size(reader.SecondStruct._CT));
        arena.setRoot(staleRoot);
        var root = arena.getRoot(builder.SecondStruct); // Upgrade root
        assert.throws(function () { arena.getSegment(1); }, RangeError);
        root.getStructList().setPrior(staleList);
        assert.throws(function () { arena.getSegment(2); }, RangeError);
        arena.getSegment(1)._position = arena.getSegment(1).length;

        var list = root.getStructList().getPrior(); // Upgrade list

        var parallelArena = alloc.createArena(8 + first.root);
        parallelArena.setRoot(staleRoot);
        parallelArena.getRoot(builder.FirstStruct).setStructList(
            listArena.asReader().getRoot(reader.FirstStruct).getStructList()
        );

        var parallelRoot = parallelArena.asReader().getRoot(reader.FirstStruct);
        var parallelList = parallelRoot.getStructList();

        it ('should contain an identical data section', function () {
            for (var i=0; i<2; ++i) {
                var it1 = {
                    segment : parallelList._segment,
                    position : parallelList._begin
                        + i*size(reader.FirstStruct._CT)
                };

                var it2 = {
                    segment : list._segment,
                    position : list._begin
                        + i*size(reader.SecondStruct._CT)
                };

                assertDataEq(it1, it2, reader.FirstStruct._CT.dataBytes);

                // Verify that the remainder is zeroed.
                var diff = reader.SecondStruct._CT.dataBytes - reader.FirstStruct._CT.dataBytes;
                for (var j=0; j<diff; ++j)
                    assert.strictEqual(it2.segment[it2.position+i], 0);
            }
        });

        it ('should contain pointers that dereference identically', function () {
            for (var i=0; i<2; ++i) {
                var it1 = {
                    segment : parallelList._segment,
                    position : parallelList._begin
                        + reader.FirstStruct._CT.dataBytes
                        + i*size(reader.FirstStruct._CT)
                };

                var it2 = {
                    segment : list._segment,
                    position : list._begin
                        + reader.SecondStruct._CT.dataBytes
                        + i*size(reader.SecondStruct._CT)
                };

                assertPointersEq(
                    parallelArena, arena,
                    it1, it2,
                    reader.FirstStruct._CT.pointersBytes / 8
                );

                // Verify that the remainder is zeroed.
                var diff = reader.SecondStruct._CT.pointersBytes - reader.FirstStruct._CT.pointersBytes;
                for (var j=0; j<diff; ++j)
                    assert.strictEqual(it2.segment[it2.position+j], 0);
            }
        });
    });

    describe ('Single Far to Single Far', function () {
        /*
         * Size arena to allocate list of structs on a different segment than
         * the associated blobs.
         */
        var arena = alloc.createArena(8 + first.root + 8 + 2*size(reader.FirstStruct._CT));
        arena.setRoot(staleRoot);
        arena.getRoot(builder.FirstStruct).setStructList(
            listArena.asReader().getRoot(reader.FirstStruct).getStructList()
        );
        var finalSegment = arena.getSegment(arena._segments.length - 1);

        /*
         * Force the struct list upgrade onto a lone segment and disallow
         * further allocations on the blobs' segment.
         */
        finalSegment._position = finalSegment.length;

        var root = arena.getRoot(builder.SecondStruct);
        var list = root.getStructList().getPrior();

        var parallelArena = alloc.createArena(8 + first.root + 8 + 2*size(reader.FirstStruct._CT));
        parallelArena.setRoot(staleRoot);
        parallelArena.getRoot(builder.FirstStruct).setStructList(
            listArena.asReader().getRoot(reader.FirstStruct).getStructList()
        );

        var parallelRoot = parallelArena.asReader().getRoot(reader.FirstStruct);
        var parallelList = parallelRoot.getStructList();

        it ('should contain an identical data section', function () {
            for (var i=0; i<2; ++i) {
                var it1 = {
                    segment : parallelList._segment,
                    position : parallelList._begin + i*size(reader.FirstStruct._CT)
                };

                var it2 = {
                    segment : list._segment,
                    position : list._begin + i*size(reader.SecondStruct._CT)
                };

                assertDataEq(it1, it2, reader.FirstStruct._CT.dataBytes);

                // Verify that the remainder is zeroed.
                var diff = reader.SecondStruct._CT.dataBytes - reader.FirstStruct._CT.dataBytes;
                for (var j=0; j<diff; ++j)
                    assert.strictEqual(it2.segment[it2.position+j], 0);
            }
        });

        it ('should contain pointers that dereference identically', function () {
            for (var i=0; i<2; ++i) {
                var it1 = {
                    segment : parallelList._segment,
                    position : parallelList._begin
                        + reader.FirstStruct._CT.dataBytes
                        + i*size(reader.FirstStruct._CT)
                };

                var it2 = {
                    segment : list._segment,
                    position : list._begin
                        + reader.SecondStruct._CT.dataBytes
                        + i*size(reader.SecondStruct._CT)
                };

                assertPointersEq(
                    parallelArena, arena,
                    it1, it2,
                    reader.FirstStruct._CT.pointersBytes / 8
                );

                // Verify that the remainder is zeroed.
                var diff = reader.SecondStruct._CT.pointersBytes - reader.FirstStruct._CT.pointersBytes;
                for (var j=0; j<diff; ++j)
                    assert.strictEqual(it2.segment[it2.position+j], 0);
            }
        });

        // Double far pointers remain unaltered.
    });
});
