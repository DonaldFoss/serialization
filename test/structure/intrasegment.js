var assert = require('assert');
var builder = require('../../node/builder/layout/structure');
var reader = require('../../node/reader/layout/structure');

var offset = 3;

var ct = {
    meta : 0,
    dataBytes : 8,
    pointersBytes : 8
};

var rt = {
    meta : 0,
    dataBytes : 16,
    pointersBytes : 24,
};

describe ('Intrasegment struct pointer', function () {
    var segment = new Buffer(80);
    segment.fill(0);
    var p = { segment:segment, position:0 };
    var blob = { segment:segment, position:32 };
    builder.preallocated(p, blob, ct);

    it ('should get populated according to specification', function () {
        assert.equal(segment[p.position], 0 | (offset<<2));
        assert.equal(segment[p.position+1], 0);
        assert.equal(segment[p.position+2], 0);
        assert.equal(segment[p.position+3], 0);
        assert.equal(segment[p.position+4], ct.dataBytes>>>3);
        assert.equal(segment[p.position+5], 0);
        assert.equal(segment[p.position+6], ct.pointersBytes>>>3);
        assert.equal(segment[p.position+7], 0);
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
