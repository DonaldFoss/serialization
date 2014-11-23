var assert = require('assert');
var ramda = require('ramda');

var fixture = require('./fixture');

var Allocator = require('../../node/builder/Allocator');
var builder = require('../testing.capnp.d/builders');
var reader = require('../testing.capnp.d/readers');
var layout = require('../../node/reader/layout/any');

var alloc = new Allocator();

// Implement 0.5 spec to make this much easier.
describe ('Stale datum field', function () {
    it ('should have tests', function () { assert(0); });
});

describe ('Fresher than compile-time datum field', function () {
    // Upgraded to struct
    it ('should have tests', function () { assert(0); });
});

describe ('Stale Struct field', function () {
    var sArena = alloc.createArena();
    var root = fixture.firstInject(
        sArena.initRoot(builder.FirstStruct),
        fixture.firstRoot
    );
    var sf = fixture.firstInject(root.getStructField(), fixture.firstSf);
    fixture.firstValidate(root, fixture.firstRoot);
    fixture.firstValidate(root.getStructField(), fixture.firstSf);

    var staleRoot = sArena.asReader().getRoot(reader.SecondStruct);
    var staleSf = staleRoot.getStructField();

    it ('should read default values from missing fields', function () {
        fixture.secondValidate(
            staleRoot,
            ramda.mixin(fixture.secondDefaults, fixture.firstRoot)
        );
        fixture.secondValidate(
            staleSf,
            ramda.mixin(fixture.secondDefaults, fixture.firstSf)
        );
    });

    it ('should set into a parent without growing', function () {
        var parent = alloc.createArena().initRoot(builder.SecondStruct);
        parent.setStructField(staleSf);
        var ell = layout.unsafe(parent._arena, {
            segment : parent._segment,
            position : parent._pointersSection+16
        });
        assert.strictEqual(ell.meta, 0);
        assert.strictEqual(
            ell.end - ell.dataSection,
            staleSf._layout().end - staleSf._layout().dataSection
        );
    });

    it ('should grow to compile-time size on a builder\'s first access', function () {
        var parent = alloc.createArena().initRoot(builder.SecondStruct);
        parent.setStructField(staleSf);
        var freshened = parent.getStructField();
        assert.strictEqual(
            freshened._layout().end - freshened._layout().dataSection,
            builder.SecondStruct._CT.dataBytes + builder.SecondStruct._CT.pointersBytes
        );
    });

    it ('should grow to compile-time size on disown', function () {
        var parent = alloc.createArena().initRoot(builder.SecondStruct);
        parent.setStructField(staleSf);
        var freshened = parent.disownStructField();
        assert.strictEqual(
            freshened._layout().end - freshened._layout().dataSection,
            builder.SecondStruct._CT.dataBytes + builder.SecondStruct._CT.pointersBytes
        );
    });
});

describe ('Fresher than compile-time Struct field', function () {
    var sArena = alloc.createArena();
    var root = fixture.secondInject(
        sArena.initRoot(builder.SecondStruct),
        fixture.secondRoot
    );
    var sf = fixture.secondInject(root.getStructField(), fixture.secondSf);
    fixture.secondValidate(root, fixture.secondRoot);
    fixture.secondValidate(root.getStructField(), fixture.secondSf);

    var freshRoot = sArena.asReader().getRoot(reader.FirstStruct);
    var freshSf = freshRoot.getStructField();

    it ('should set into a parent without truncating', function () {
        var parent = alloc.createArena().initRoot(builder.FirstStruct);
        parent.setStructField(freshSf);
        var ell = layout.unsafe(parent._arena, {
            segment : parent._segment,
            position : parent._pointersSection+16
        });
        assert.strictEqual(ell.meta, 0);
        assert.strictEqual(
            ell.end - ell.dataSection,
            sf._layout().end - sf._layout().dataSection
        );

    });

    it ('should not get truncated on a builder\'s first access', function () {
        var parent = alloc.createArena().initRoot(builder.FirstStruct);
        parent.setStructField(freshSf);
        var child = parent.getStructField();
        assert.strictEqual(
            child._layout().end - child._layout().dataSection,
            sf._layout().end - sf._layout().dataSection
        );
    });

    it ('should not get truncated on disown', function () {
        var parent = alloc.createArena().initRoot(builder.FirstStruct);
        parent.setStructField(freshSf);
        var child = parent.disownStructField();
        assert.strictEqual(
            child._layout().end - child._layout().dataSection,
            sf._layout().end - sf._layout().dataSection
        );
    });
});

// Implement 0.5 spec to make this much easier.
describe ('Stale Text field', function () {
    it ('should have tests', function () { assert(0); });
});

describe ('Fresher than compile-time Text field', function () {
    // Upgraded to struct
    it ('should have tests', function () { assert(0); });
});

describe ('Stale Data field', function () {
    it ('should have tests', function () { assert(0); });
});

describe ('Fresher than compile-time Data field', function () {
    // Upgraded to struct
    it ('should have tests', function () { assert(0); });
});

describe ('Stale List field', function () {
    it ('should have tests', function () { assert(0); });
});

describe ('Fresher than compile-time List field', function () {
    // Upgraded to struct
    it ('should have tests', function () { assert(0); });
});

describe ('Stale AnyPointer field', function () {
    it ('should have tests', function () { assert(0); });
});

describe ('Fresher than compile-time AnyPointer field', function () {
    // Upgraded to struct
    it ('should have tests', function () { assert(0); });
});
