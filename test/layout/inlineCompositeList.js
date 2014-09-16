var assert = require('assert');
var layout = require('../../node/reader/layout/list');

var intra = new Uint8Array([0x01 | 0x04, 0x00, 0x00, 0x00,
                            0x07 | 0xe8, 0x11, 0x32, 0x1c]);

var tag = new Uint8Array([0x00 | 0x1b, 0x02, 0x1a, 0x11,
                                 0x04, 0x1c, 0x1a, 0x00]);
                         
var segment = new Uint8Array(24);
segment.set(intra, 0);
segment.set(tag, 16);

var offset = 0x04 >>> 2;
var length = (0x1b >>> 2) + (0x02 << 6) + (0x1a << 14) + (0x11 << 22);
var data = 0x04 + (0x1c << 8);
var pointers = 0x1a + (0x00 << 8);

describe('Intrasegment pointers', function () {
    it('should compute data regions', function () {
        var x = layout.intrasegment([segment], segment, 0);

        /*
         * 8 to get to the end of the pointer, and another 8 to get by the tag
         * word.
         */
        assert.equal(x.begin, 8*offset + 8 + 8);
        assert.equal(x.length, length);
        assert.equal(x.dataBytes, 8*data);
        assert.equal(x.pointersBytes, 8*pointers);
    });
});
/*
var farData = function () {
    return new Uint8Array([0x02 | 0x00 | 0xf8, 0x02, 0x00, 0x00,
                                         0x01, 0x00, 0x00, 0x00]);
};
var farOffset = (0xf8 >>> 3) + (0x02 << 5);

describe('Single hop intersegment pointers', function () {
    var first = farData();
    first[0] = first[0] | 0x00;

    var far = new Uint8Array(1000);
    far[8*farOffset + 0] = intra[0];
    far[8*farOffset + 1] = intra[1];
    far[8*farOffset + 2] = intra[2];
    far[8*farOffset + 3] = intra[3];
    far[8*farOffset + 4] = intra[4];
    far[8*farOffset + 5] = intra[5];
    far[8*farOffset + 6] = intra[6];
    far[8*farOffset + 7] = intra[7];

    it('should compute data regions', function () {
        var x = layout.intersegment([first, far], first, 0);

        assert.equal(x.begin, 8*farOffset + 8*offset + 8);
        assert.equal(x.dataBytes, size);
        assert.equal(x.length, length);
    });
});

describe('Double hop intersegment pointers', function () {
    var first = farData()
    first[0] = first[0] | 0x04;

    var far = new Uint8Array(1000);
    far[8*farOffset + 0] = 0x02 | 0x00 | 0xa0;
    far[8*farOffset + 1] = 0x06;
    far[8*farOffset + 2] = 0x00;
    far[8*farOffset + 3] = 0x00;
    far[8*farOffset + 4] = 0x02;
    far[8*farOffset + 5] = 0x00;
    far[8*farOffset + 6] = 0x00;
    far[8*farOffset + 7] = 0x00;
    var farOffset2 = (0xa0 >>> 3) + (0x06 << 5);

    far[8*farOffset +  8] = intra[0] & 0x03;
    far[8*farOffset +  9] = intra[1] & 0x00;
    far[8*farOffset + 10] = intra[2] & 0x00;
    far[8*farOffset + 11] = intra[3] & 0x00;
    far[8*farOffset + 12] = intra[4];
    far[8*farOffset + 13] = intra[5];
    far[8*farOffset + 14] = intra[6];
    far[8*farOffset + 15] = intra[7];

    it('should compute data regions', function () {
        var x = layout.intersegment([first, far, null], first, 0);

        assert.equal(x.begin, 8*farOffset2);
        assert.equal(x.dataBytes, size);
        assert.equal(x.length, length);
    });
});
*/
