var assert = require('assert');
var layout = require('../../node/reader/layout/list');

var intra = new Uint8Array([0x01 | 0x1a, 0xab, 0x2e, 0x1b,
                            0x04 | 0xe8, 0x11, 0x32, 0x1c]);
var offset = (0x1a >>> 2) + (0xab << 6) + (0x2e << 14) + (0x1b << 22);
var size = 4;
var length = (0xe8 >>> 3) + (0x11 << 5) + (0x32 << 13) + (0x1c << 21);

describe('Intrasegment pointers', function () {
    it('should compute data regions', function () {
        var x = layout.intrasegment([intra], intra, 0);

        assert.equal(x.begin, 8*offset + 8);
        assert.equal(x.dataBytes, size);
        assert.equal(x.length, length);
    });
});

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
