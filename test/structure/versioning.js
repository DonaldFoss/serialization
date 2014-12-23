var assert = require('assert');
var ramda = require('ramda');

var fixture = require('./fixture');

var Allocator = require('../../node/builder/Allocator');
var builder = require('../testing.capnp.d/builders');
var reader = require('../testing.capnp.d/readers');
var layout = require('../../node/reader/layout/any');

var alloc = new Allocator();

describe ('Stale Struct field', function () {
    var sArena = alloc.createArena();
    var root = fixture.inject(
        sArena.initRoot(builder.FirstStruct),
        fixture.first
    );
    fixture.validate(root, fixture.first);

    var staleRoot = sArena.asReader().getRoot(reader.SecondStruct);

    it ('should read default values from missing fields', function () {
        var diff = ramda.omit(
            Object.keys(fixture.firstDefaults),
            fixture.secondDefaults
        );

        fixture.validate(
            staleRoot,
            ramda.mixin(diff, fixture.priorize({
                structField : fixture.leaf('SecondStruct', diff)
            }))
        );
    });

    it ('should set into a parent without growing', function () {
        var parent = alloc.createArena().initRoot(builder.SecondStruct);
        var staleLeaf = staleRoot.getStructField().getPrior();
        parent.getStructField().setPrior(staleLeaf);
        var ell = layout.unsafe(parent._arena, {
            segment : parent._segment,
            position : parent._pointersSection+16
        });
        assert.strictEqual(ell.meta, 0);
        assert.strictEqual(
            ell.end - ell.dataSection,
            staleLeaf._layout().end - staleLeaf._layout().dataSection
        );
    });

    it ('should grow to compile-time size on a builder\'s first access', function () {
        var parent = alloc.createArena().initRoot(builder.SecondStruct);
        parent.getStructField().setPrior(staleRoot);
        var freshened = parent.getStructField().getPrior();
        assert.strictEqual(
            freshened._layout().end - freshened._layout().dataSection,
            builder.SecondStruct._CT.dataBytes + builder.SecondStruct._CT.pointersBytes
        );
        fixture.validate(
            freshened,
            ramda.mixin(
                ramda.pick(Object.keys(fixture.first), fixture.second),
                fixture.priorize({
                    structField : fixture.leaf('SecondStruct', ramda.pick(
                        Object.keys(fixture.first.structField.value),
                        fixture.second.structField.value.prior.value
                    ))
                })
            )
        );
    });

    it ('should grow to compile-time size on disown', function () {
        var parent = alloc.createArena().initRoot(builder.SecondStruct);
        var staleLeaf = staleRoot.getStructField().getPrior();
        parent.getStructField().setPrior(staleLeaf);
        var freshened = parent.getStructField().disownPrior();
        assert.strictEqual(
            freshened._layout().end - freshened._layout().dataSection,
            builder.SecondStruct._CT.dataBytes + builder.SecondStruct._CT.pointersBytes
        );
    });
});

describe ('Fresher than compile-time field', function () {
    var sArena = alloc.createArena();
    var root = fixture.inject(
        sArena.initRoot(builder.SecondStruct),
        fixture.second
    );
    fixture.validate(root, fixture.second);

    var freshRoot = sArena.asReader().getRoot(reader.FirstStruct);
    var freshLeaf = freshRoot.getStructField();

    it ('should set into an arena without truncating', function () {
        var arena = alloc.createArena();
        arena.setRoot(freshRoot);
        var image = arena.asReader().getRoot(reader.SecondStruct);

        assert.strictEqual(
            freshLeaf._layout().end - freshLeaf._layout().dataSection,
            reader.SecondStruct._CT.dataBytes + reader.SecondStruct._CT.pointersBytes
        );
        fixture.validate(image, fixture.second);
    });

    it ('should set into a parent without truncating', function () {
        var arena = alloc.createArena();
        var parent = arena.initRoot(builder.FirstStruct);

        parent.setStructField(freshRoot);
        fixture.validate(
            arena.getRoot(builder.SecondStruct).getStructField().getPrior(),
            fixture.second
        );
        fixture.validate(
            arena.asReader().getRoot(reader.SecondStruct).getStructField().getPrior(),
            fixture.second
        );
    });

    it ('should not get truncated on a builder\'s first access', function () {
        var parent = alloc.createArena().initRoot(builder.FirstStruct);
        parent.setStructField(freshLeaf);
        var child = parent.getStructField();
        assert.strictEqual(
            child._layout().end - child._layout().dataSection,
            reader.SecondStruct._CT.dataBytes + reader.SecondStruct._CT.pointersBytes
        );
    });

    it ('should not get truncated on disown', function () {
        var parent = alloc.createArena().initRoot(builder.FirstStruct);
        parent.setStructField(freshLeaf);
        var child = parent.disownStructField();
        assert.strictEqual(
            child._layout().end - child._layout().dataSection,
            reader.SecondStruct._CT.dataBytes + reader.SecondStruct._CT.pointersBytes
        );
    });
});

describe ('Stale AnyPointer field', function () {
    it ('should have tests', function () {
        assert(0);
    });
});
