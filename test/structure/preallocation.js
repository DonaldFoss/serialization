var assert = require('assert');
var builder = require('../../node/builder/layout/structure');
var reader = require('../../node/reader/layout/structure');

var ct = {
    meta : 0,
    dataBytes : 8,
    pointersBytes : 8
};

describe ('Preallocated structure pointers', function () {
    describe ('Intrasegment', function () {
        var segment = new Buffer(80);
        segment.fill(0);
        var p = { segment:segment, position:0 };
        var blob = { segment:segment, position:32 };
        var offset = 3;
        builder.preallocated(p, blob, ct);

        it ('should get populated according to specification', function () {
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

    describe ('Intersegment', function () {
        var segment0=new Buffer(80); segment0._id=0; segment0._position=80;
        var segment1=new Buffer(80); segment1._id=1; segment1._position=80;
        segment0.fill(0);
        segment1.fill(0);
        var p = { segment:segment0, position:8 };
        var land = { segment:segment1, position:24 };
        var offset = 3;
        var blob = { segment:segment1, position:32 };
        builder.preallocated(p, blob, ct);

        it ('should get populated according to specification', function () {
            assert.equal(segment0[p.position], 2 | (0<<2) | (offset<<3));
            assert.equal(segment0[p.position+1], offset>>>5);
            assert.equal(segment0[p.position+2], offset>>>13);
            assert.equal(segment0[p.position+3], offset>>>21);
            assert.equal(segment0[p.position+4], 1);
            assert.equal(segment0[p.position+5], 0);
            assert.equal(segment0[p.position+6], 0);
            assert.equal(segment0[p.position+7], 0);
        });

        it ('should point to a landing pad that is immediately followed by its blob', function () {
            assert.equal(segment1[land.position], 0 | (0<<2));
            assert.equal(segment1[land.position+1], 0);
            assert.equal(segment1[land.position+2], 0);
            assert.equal(segment1[land.position+3], 0);
            assert.equal(segment1[land.position+4], ct.dataBytes>>>3);
            assert.equal(segment1[land.position+5], ct.dataBytes>>>11);
            assert.equal(segment1[land.position+6], ct.pointersBytes>>>3);
            assert.equal(segment1[land.position+7], ct.pointersBytes>>>11);
        });

        it ('should parametrize the layout of a blob', function () {
            var layout = reader.intersegment(land, blob);
            assert.equal(ct.meta, layout.meta);
            assert.equal(blob.segment, layout.segment);
            assert.equal(blob.position, layout.dataSection);
            assert.equal(blob.position+ct.dataBytes, layout.pointersSection);
            assert.equal(blob.position+ct.dataBytes+ct.pointersBytes, layout.end);
        });
    });
});
