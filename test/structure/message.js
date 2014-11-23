var assert = require('assert');
var ramda = require('ramda');
var Int64 = require('int64-native');

var fixture = require('./fixture');
var encode = require('../encode');
var decode = require('../decode');

var Allocator = require('../../node/builder/Allocator');
var nonframed = require('../../node/nonframed');
var builder = require('../testing.capnp.d/builders');
var reader = require('../testing.capnp.d/readers');

var alloc = new Allocator();

var sl1 = ramda.mixin(fixture.secondRoot, {
    int8Field : -87,
    uint16Field : 31049,
    textField : 'sl1 text',
    addedEnumField : reader.SecondEnum.QUATRO
});

var sl2 = ramda.mixin(fixture.secondSf, {
    int16Field : -8700,
    dataField : new Buffer([0x61, 0x79, 0x65]),
    addedEnumField : reader.SecondEnum.UNO
});

var second = ramda.mixin(fixture.secondRoot, {
    structField : fixture.secondSf,
    structList : [sl1, sl2]
});

var invInvEnum = { uno:0, dos:1, tres:2, quatro:3, sinko:4 };
var invEnum =    ['uno', 'dos', 'tres', 'quatro', 'sinko'];

var toolInput = function (obj) {
    function datum(value) {

        if (Array.isArray(value)) {
            // 64 bit integral
            var prefix;
            var hi;
            var lo;
            if (value[0] < 0) {
                // [-x,y] -> -[x,y] -> -(x.concat(y))
                prefix = '-0x';
                if (value[1] === 0) {
                    // Carry the overflow.
                    lo = '0';
                    hi = ((~value[0] + 1 + 1)>>>0).toString(16);
                } else {
                    lo = ((~value[1] + 1)>>>0).toString(16);
                    hi = ((~value[0]    )>>>0).toString(16);
                }
            } else {
                prefix = '0x';
                lo = value[1].toString(16);
                hi = value[0].toString(16);
            }

            var zeros = "00000000";
            return prefix + hi.toString(16) + zeros.substring(0, 8-lo.length) + lo;
        } else if (typeof value === 'string')
            return '"'+value+'"';
        else if (value instanceof Buffer)
            return '"'+value.toString('ascii')+'"';
        else if (value === null)
            return 'void';
        else if (typeof value === 'object')
            return toolInput(value)
        else
            return value;
    }

    var output = [];
    for (var k in obj) {
        if (k.slice(k.length-4) === 'List') {
            var ell=[];
            switch (k) {
            case 'enumList':
            case 'addedEnumList':
                ell = obj[k].map(function (e) { return invEnum[e]; });
                break;
            default:
                for (var i=0; i<obj[k].length; ++i) {
                    ell.push(datum(obj[k][i]));
                }
            }
            output.push(k+' = '+'['+ell.join(', ')+']');
        } else if (k.slice(k.length-5) === 'Field') {
            switch (k) {
            case 'enumField':
            case 'addedEnumField':
                output.push(k+' = '+invEnum[obj[k]]);
                break;
            default:
                output.push(k+' = '+datum(obj[k]));
            }
        } else {
            throw new Error('Unrecognized key: '+k);
        }
    }

    return '('+output.join(', ')+')';
};

describe('Message reading', function () {
    /*
     * * Construct a message parametrization.
     * * Convert the parametrization to a ()-thingy, and then pipe it through
     *   `capnp encode` to obtain a message.
     * * Wrap the message with a reader, and then validate the reader's outputs
     *   against the message parametrization.
     */
    it ('should reproduce the message writer\'s inputs', function (done) {
        encode(toolInput(second), 'SecondStruct')
            .done(
                function (result) {
                    var root = nonframed.toArena(result).getRoot(reader.SecondStruct);
                    fixture.secondValidate(root, second);
                    fixture.secondValidate(root.getStructField(), second.structField);
                    fixture.secondValidate(root.getStructList().get(0), second.structList[0]);
                    fixture.secondValidate(root.getStructList().get(1), second.structList[1]);
                    done();
                },
                function (err) {
                    assert(0, err);
                    done();
                }
            );
    });
});

var toolOutput= function (obj) {
    function datum(key, value) {
        if (value === null) return null;

        key = key.toLowerCase();
        var i;
        if (key.search('uint64') >= 0) {
            i = new Int64(value);
            return [i.high32(), i.low32()];
        } else if (key.search('int64') >= 0) {
            i = new Int64(value);
            return [i.high32()|0, i.low32()];
        } else if (key.search('data') >= 0)
            return new Buffer(value);
        else if (key.search('float') >= 0)
            return parseFloat(value);
        else if(key.search('int') >= 0)
            return parseInt(value);
        else if (key.search('struct') >= 0)
            return toolOutput(value);
        else
            return value;
    }

    var output = {};
    for (var k in obj) {
        if (k.slice(k.length-4) === 'List') {
            var ell=[];
            switch (k) {
            case 'enumList':
            case 'addedEnumList':
                output[k] = obj[k].map(function (e) { return invInvEnum[e]; });
                break;
            default:
                for (var i=0; i<obj[k].length; ++i) {
                    ell.push(datum(k, obj[k][i]));
                }
                output[k] = ell;
            }
        } else if (k.slice(k.length-5) === 'Field') {
            switch (k) {
            case 'enumField':
            case 'addedEnumField':
                output[k] = invInvEnum[obj[k]];
                break;
            default:
                output[k] = datum(k, obj[k]);
            }
        } else {
            throw new Error('Unrecognized key: '+k);
        }
    }

    return output;
};

describe ('Message writing', function () {
    /*
     * * Construct a message parametrization.
     * * Build a message from the parametrization.
     * * Pipe the message through `capnp decode` to obtain one of those
     *   ()-thingies.
     * * Parse the ()-thingy to an object, and then validate the object against
     *   the parametrization.
     */
    it ('should produce messages that external readers understand', function (done) {
        var root = alloc.createArena().initRoot(builder.SecondStruct);

        fixture.secondInject(root, fixture.secondRoot);
        fixture.secondInject(root.getStructField(), second.structField);

        var ell = root.initStructList(2);
        fixture.secondInject(ell.get(0), second.structList[0]);
        fixture.secondInject(ell.get(1), second.structList[1]);

        decode(nonframed.fromStruct(root), 'SecondStruct')
            .done(
                function (result) {
                    result = toolOutput(result);
                    fixture.secondValidate(root, result);
                    fixture.secondValidate(root.getStructField(), result.structField);
                    fixture.secondValidate(root.getStructList().get(0), result.structList[0]);
                    fixture.secondValidate(root.getStructList().get(1), result.structList[1]);
                    done();
                },
                function (err) {
                    done();
                }
            );
    });
});
