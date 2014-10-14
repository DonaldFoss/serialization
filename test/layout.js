var assert = require('assert');
var builder = require('../node/builder/layout/list');
var reader = require('../node/reader/layout/list');

var segment = new Buffer(80);
var p = { segment:segment, position:0 };
var blob = { segment:segment, position:32 };
var offset = 3;

describe ('Intrasegment list pointers', function () {
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
        pointersBytes : 8,
    };

    it ('should have tagless blobs when non-composite-inline', function () {
        segment.fill(0);
        var length = 5;
        builder.preallocated(p, blob, ct, length);
        var layout = reader.intrasegment(p);

        // Check builder
        assert.equal(segment[p.position], 1 | (offset<<2));
        assert.equal(segment[p.position+1], 0);
        assert.equal(segment[p.position+2], 0);
        assert.equal(segment[p.position+3], 0);
        assert.equal(segment[p.position+4], ct.layout | (length<<3));
        assert.equal(segment[p.position+5], 0);
        assert.equal(segment[p.position+6], 0);
        assert.equal(segment[p.position+7], 0);

        assert.equal(segment[blob.position], 0);
        assert.equal(segment[blob.position+1], 0);
        assert.equal(segment[blob.position+2], 0);
        assert.equal(segment[blob.position+3], 0);
        assert.equal(segment[blob.position+4], 0);
        assert.equal(segment[blob.position+5], 0);
        assert.equal(segment[blob.position+6], 0);
        assert.equal(segment[blob.position+7], 0);

        // Check reader
        assert.equal(ct.meta, layout.meta);
        assert.equal(ct.dataBytes, layout.dataBytes);
        assert.equal(ct.pointersBytes, layout.pointersBytes);
        assert.equal(length, layout.length);
        assert.equal(blob.position, layout.begin);
        assert.equal(blob.segment, layout.segment);
    });

    it ('should have tagged blobs when composite-inline', function () {
        segment.fill(0);
        var length = 8;
        builder.preallocated(p, blob, rt, length);
        var layout = reader.intrasegment(p);

        // Check builder
        assert.equal(segment[p.position], 1 | (offset<<2));
        assert.equal(segment[p.position+1], 0);
        assert.equal(segment[p.position+2], 0);
        assert.equal(segment[p.position+3], 0);
        assert.equal(segment[p.position+4], rt.layout | ((2*length)<<3));
        assert.equal(segment[p.position+5], 0);
        assert.equal(segment[p.position+6], 0);
        assert.equal(segment[p.position+7], 0);

        assert.equal(segment[blob.position], length<<2);
        assert.equal(segment[blob.position+1], 0);
        assert.equal(segment[blob.position+2], 0);
        assert.equal(segment[blob.position+3], 0);
        assert.equal(segment[blob.position+4], 1);
        assert.equal(segment[blob.position+5], 0);
        assert.equal(segment[blob.position+6], 1);
        assert.equal(segment[blob.position+7], 0);

        // Check reader
        var layout = reader.intrasegment(p);
        assert.equal(rt.meta, layout.meta);
        assert.equal(rt.dataBytes, layout.dataBytes);
        assert.equal(rt.pointersBytes, layout.pointersBytes);
        assert.equal(length, layout.length);
        assert.equal(blob.position+8, layout.begin);
        assert.equal(blob.segment, layout.segment);
    });
});
