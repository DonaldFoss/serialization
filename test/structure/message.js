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

var sl1 = ramda.mixin(fixture.second, fixture.priorize({
    int8Field : fixture.leaf('Int8', -87),
    uint16Field : fixture.leaf('UInt16', 31049),
    textField : fixture.leaf('Text', 'sl1 text'),
    addedEnumField : fixture.leaf('SecondEnum', reader.SecondEnum.QUATRO)
}));

var sl2 = ramda.mixin(fixture.second, fixture.priorize({
    int16Field : fixture.leaf('Int16', -8700),
    dataField : fixture.leaf('Data', new Buffer([86, 104, 99])),
    addedEnumField : fixture.leaf('SecondEnum', reader.SecondEnum.UNO)
}));

var second = ramda.mixin(fixture.second, fixture.priorize({
    structList : fixture.leaf(
        'SecondStructList',
        [sl2, sl1, sl2].map(fixture.leafize('SecondStruct'))
    )
}));

var invInvEnum = { uno:0, dos:1, tres:2, quatro:3, sinko:4 };
var invEnum =    ['uno', 'dos', 'tres', 'quatro', 'sinko'];

var join64bit = function (value) {
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
};

/*
 * Compute input for the Capnproto encoder.
 *
 * struct - fieldName -> {type : x, value : y}
 */
var toolInput = function (struct) {
    function isPointer(f) {
        switch (f.type) {
        case 'Text':
        case 'Data':
        case 'AnyPointer':
        case 'FirstStruct':
        case 'SecondStruct':
        case 'VoidList':
        case 'BoolList':
        case 'Int8List':
        case 'Int16List':
        case 'Int32List':
        case 'Int64List':
        case 'UInt8List':
        case 'UInt16List':
        case 'UInt32List':
        case 'UInt64List':
        case 'Float32List':
        case 'Float64List':
        case 'TextList':
        case 'DataList':
        case 'AnyPointerList':
        case 'FirstEnumList':
        case 'SecondEnumList':
        case 'FirstStructList':
        case 'SecondStructList':
            return true;
        default:
            return false;
        }
    }

    function value(f) {
        switch (f.type) {
        case 'Void':
            return 'void';

        case 'Bool':
        case 'Int8':
        case 'Int16':
        case 'Int32':
        case 'UInt8':
        case 'UInt16':
        case 'UInt32':
        case 'Float32':
        case 'Float64':
            return f.value;

        case 'Int64':
        case 'UInt64':
            return join64bit(f.value);

        case 'Text':
        case 'Data':
            return '"'+f.value+'"';

        case 'AnyPointer':
            throw new Error('Need AnyPointer support');

        case 'FirstEnum':
        case 'SecondEnum':
            return invEnum[f.value];

        case 'Group':
        case 'FirstStruct':
        case 'SecondStruct':
        case 'UpgradeSecondStruct':
        case 'SecondEnumWrap':
        case 'VoidWrap':
        case 'BoolWrap':
        case 'Int8Wrap':
        case 'Int16Wrap':
        case 'Int32Wrap':
        case 'Int64Wrap':
        case 'UInt8Wrap':
        case 'UInt16Wrap':
        case 'UInt32Wrap':
        case 'UInt64Wrap':
        case 'Float32Wrap':
        case 'Float64Wrap':
        case 'UpgradeData':
        case 'UpgradeText':
            return toolInput(f.value);

        case 'VoidList':
        case 'BoolList':
        case 'Int8List':
        case 'Int16List':
        case 'Int32List':
        case 'Int64List':
        case 'UInt8List':
        case 'UInt16List':
        case 'UInt32List':
        case 'UInt64List':
        case 'Float32List':
        case 'Float64List':
        case 'TextList':
        case 'DataList':
        case 'AnyPointerList':
        case 'FirstEnumList':
        case 'SecondEnumList':
        case 'FirstStructList':
        case 'SecondStructList':
        case 'UpgradeSecondStructList':
        case 'SecondEnumWrapList':
        case 'VoidWrapList':
        case 'BoolWrapList':
        case 'Int8WrapList':
        case 'Int16WrapList':
        case 'Int32WrapList':
        case 'Int64WrapList':
        case 'UInt8WrapList':
        case 'UInt16WrapList':
        case 'UInt32WrapList':
        case 'UInt64WrapList':
        case 'Float32WrapList':
        case 'Float64WrapList':
        case 'UpgradeDataList':
        case 'UpgradeTextList':
            return '[' + f.value.map(value).join(', ') + ']';

        default:
            throw new Error('Unhandled input value: ' + f.type);
        }
    }

    var output = [];
    for (var k in struct) {
        var f = struct[k];
        if (!isPointer(f) || f.value !== null)
            output.push(k+' = '+value(f));
    }

    return '(' + output.join(', ') + ')';
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
            .done(function (result) {
                var root = nonframed.toArena(result).getRoot(reader.SecondStruct);
                fixture.validate(root, second);
                done();
            });
    });
});

// map obj from capnp.peg to parallel the spec object (leafy)
var toolOutput= function (spec, obj) {
    function stripList (name) {
        if (name.slice(name.length-4) !== 'List')
            throw new Error(name + ' does not have a trailing `List`');

        return name.slice(0, name.length-4);
    }

    function int64(value) {
        var i = new Int64(value);
        return [i.high32()|0, i.low32()];
    }

    function uint64(value) {
        var i = new Int64(value);
        return [i.high32(), i.low32()];
    }

    function field(spec, value) {
        var type = spec.type;
        switch (type) {
        case 'Void':
            return fixture.leaf(type, null);

        case 'Bool':
            return fixture.leaf(type, !!value);

        case 'Int8':
        case 'Int16':
        case 'Int32':
        case 'UInt8':
        case 'UInt16':
        case 'UInt32':
            return fixture.leaf(type, parseInt(value));

        case 'Float32':
        case 'Float64':
            return fixture.leaf(type, parseFloat(value));

        case 'Text':
            return fixture.leaf(type, value);

        case 'Data':
            if (value instanceof Buffer) return fixture.leaf(type, value);

            return fixture.leaf(type, new Buffer(value));

        case 'Int64':
            return fixture.leaf(type, int64(value));

        case 'UInt64':
            return fixture.leaf(type, uint64(value));

        case 'AnyPointer':
            throw new Error('Need AnyPointer support');

        case 'SecondEnum':
            return fixture.leaf(type, invInvEnum[value]);

        case 'Group':
        case 'SecondStruct':
        case 'UpgradeSecondStruct':
        case 'SecondEnumWrap':
        case 'VoidWrap':
        case 'BoolWrap':
        case 'Int8Wrap':
        case 'Int16Wrap':
        case 'Int32Wrap':
        case 'Int64Wrap':
        case 'UInt8Wrap':
        case 'UInt16Wrap':
        case 'UInt32Wrap':
        case 'UInt64Wrap':
        case 'Float32Wrap':
        case 'Float64Wrap':
        case 'UpgradeData':
        case 'UpgradeText':
            return fixture.leaf(type, toolOutput(spec.value, value));

        case 'VoidList':
            return fixture.leaf(type, value.map(function (v) {
                return fixture.leaf('Void', null);
            }));

        case 'BoolList':
            return fixture.leaf(type, value.map(function (v) {
                return fixture.leaf('Bool', !!v);
            }));

        case 'Int8List':
        case 'Int16List':
        case 'Int32List':
        case 'UInt8List':
        case 'UInt16List':
        case 'UInt32List':
            return fixture.leaf(type, value.map(function (v) {
                return fixture.leaf(stripList(type), parseInt(v));
            }));

        case 'Float32List':
        case 'Float64List':
            return fixture.leaf(type, value.map(function (v) {
                return fixture.leaf(stripList(type), parseFloat(v));
            }));

        case 'Int64List':
            return fixture.leaf(type, value.map(function (v) {
                return fixture.leaf('Int64', int64(v));
            }));

        case 'UInt64List':
            return fixture.leaf(type, value.map(function (v) {
                return fixture.leaf('UInt64', uint64(v));
            }));

        case 'DataList':
            return fixture.leaf(type, value.map(function (v) {
                if (v instanceof Buffer)
                    return fixture.leaf('Data', v);
                else
                    return fixture.leaf('Data', new Buffer(v));
            }));

        case 'TextList':
            return fixture.leaf(type, value.map(function (v) {
                return fixture.leaf(stripList(type), v);
            }));

        case 'AnyPointerList':
            if (spec.value.length === 0) return fixture.leaf(type, []);

            throw new Error('Need AnyPointer support');

        case 'SecondEnumList':
            return fixture.leaf(type, value.map(function (v) {
                return fixture.leaf('SecondEnum', invInvEnum[v]);
            }));

        case 'SecondStructList':
        case 'UpgradeSecondStructList':
        case 'SecondEnumWrapList':
        case 'VoidWrapList':
        case 'BoolWrapList':
        case 'Int8WrapList':
        case 'Int16WrapList':
        case 'Int32WrapList':
        case 'Int64WrapList':
        case 'UInt8WrapList':
        case 'UInt16WrapList':
        case 'UInt32WrapList':
        case 'UInt64WrapList':
        case 'Float32WrapList':
        case 'Float64WrapList':
        case 'UpgradeDataList':
        case 'UpgradeTextList':
            return fixture.leaf(type, value.map(function (v) {
                return fixture.leaf(stripList(type), toolOutput(spec.value, v));
            }));

        default:
            throw new Error('Unhandled output value: ' + type);
        }
    }

    var output = {};
    for (var k in obj) {
        if (spec[k] !== undefined)
            output[k] = field(spec[k], obj[k]);
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
        fixture.inject(root, second);
        decode(nonframed.fromStruct(root), 'SecondStruct')
            .done(function (result) {
                result = toolOutput(second, result);
                fixture.validate(root, result);
                done();
            });
    });
});
