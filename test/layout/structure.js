var assert = require('assert');
var layout = require('../../node/reader/layout/structure');

UNIT TEST
deep copy local
deep copy far
*
inline composite list
tagless list
structure with data and pointers

Trace all pointers, validating that data sections match

DECODING
id from both sides
custom message --capnpc-tool--> binary --deep-copy--> binary --dump--> json
custom message --capnpc-tool--> json
json diff for test

ENCODING
[{
    field : 'someFieldName',
    value : '4.38'
}, {
    field : 'someOtherFieldName',
    value : '-1343'
}]
->
builder[setSomeFieldName](4.38);
builder[setSomeOtherFieldName](-1343);
--capnp-decode-->
text
--peg-js-->
json

var intra = new Uint8Array([0x00 | 0x1a, 0xab, 0x2e, 0x1b,
                                   0xa1, 0x11, 0x32, 0x1c]);
var offset = (0x1a >>> 2) + (0xab << 6) + (0x2e << 14) + (0x1b << 22);
var data = 0xa1 + (0x11 << 8);
var pointers = 0x32 + (0x1c << 8);

describe('Intrasegment pointers', function () {
    it('should compute data regions', function () {
        var x = layout.intrasegment([intra], intra, 0);

        assert.equal(x.dataSection, 8*offset + 8);
        assert.equal(x.pointersSection - x.dataSection, 8*data);
        assert.equal(x.end - x.pointersSection, 8*pointers);
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

        assert.equal(x.dataSection, 8*farOffset + 8*offset + 8);
        assert.equal(x.pointersSection - x.dataSection, 8*data);
        assert.equal(x.end - x.pointersSection, 8*pointers);
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

        assert.equal(x.dataSection, 8*farOffset2);
        assert.equal(x.pointersSection - x.dataSection, 8*data);
        assert.equal(x.end - x.pointersSection, 8*pointers);
    });
});
