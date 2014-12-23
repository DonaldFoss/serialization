var assert = require('assert');
var ramda = require('ramda');

var reader = require('../testing.capnp.d/readers');

var leaf = function (t, v) {
    return {
        type : t,
        value : v
    };
};

var leafize = function (t) {
    return function (v) {
        return leaf(t,v);
    };
};

var upgrade = function (Type) {
    return function (value) {
        return {
            type : Type,
            value : {
                prior : value,
                boolField : leaf('Bool', false),
                int8Field : leaf('Int8', 0),
                uint32Field : leaf('UInt32', 0),
                textField : leaf('Text', null),
                dataField : leaf('Data', null),
                structField : leaf('SecondStruct', null),
                int16List : leaf('Int16List', []),
                voidList : leaf('VoidList', []),
                uint32List : leaf('UInt32List', []),
                textList : leaf('TextList', []),
                dataList : leaf('DataList', [])
            }
        };
    };
};

var wrap = function (v) { return {
    prior : v,
    int8Field : leaf('Int8', 0),
    textField : leaf('Text', "")
}; };

var priorize = ramda.mapObj(function (value) {
    return {
        type : 'Group',
        value : wrap(value)
    };
});

exports.leaf = leaf;
exports.leafize = leafize;
exports.priorize = priorize;
exports.upgrade = upgrade;

exports.firstDefaults = {
    voidField : leaf('Void', null),
    boolField : leaf('Bool', false),
    int8Field : leaf('Int8', 0),
    int16Field : leaf('Int16', 0),
    int32Field : leaf('Int32', 0),
    int64Field : leaf('Int64', [0,0]),
    uint8Field : leaf('UInt8', 0),
    uint16Field : leaf('UInt16', 0),
    uint32Field : leaf('UInt32', 0),
    uint64Field : leaf('UInt64', [0,0]),
    float32Field : leaf('Float32', 0.0),
    float64Field : leaf('Float64', 0.0),
    textField : leaf('Text', null),
    dataField : leaf('Data', null),
    structField : leaf('FirstStruct', null),
    enumField : leaf('FirstEnum', reader.FirstEnum.UNO),
    anyField : leaf('AnyPointer', null),

    voidList : leaf('VoidList', []),
    boolList : leaf('BoolList', []),
    int8List : leaf('Int8List', []),
    int16List : leaf('Int16List', []),
    int32List : leaf('Int32List', []),
    int64List : leaf('Int64List', []),
    uint8List : leaf('UInt8List', []),
    uint16List : leaf('UInt16List', []),
    uint32List : leaf('UInt32List', []),
    uint64List : leaf('UInt64List', []),
    float32List : leaf('Float32List', []),
    float64List : leaf('Float64List', []),
    textList : leaf('TextList', []),
    dataList : leaf('DataList', []),
    structList : leaf('FirstStructList', []),
    enumList : leaf('FirstEnumList', []),
    anyList : leaf('AnyList', [])
};

exports.secondDefaults = ramda.mixin(priorize(exports.firstDefaults), priorize({
    // Override upgraded types
    structField : leaf('SecondStruct', null),
    enumField : leaf('SecondEnum', reader.SecondEnum.UNO),

    addedInt16Field : leaf('Int16', -32015),
    addedEnumField : leaf('SecondEnum', reader.SecondEnum.QUATRO),
    addedStructField : leaf('SecondStruct', priorize({
        uint8Field : leaf('UInt8', 253),
        enumField : leaf('SecondEnum', reader.SecondEnum.SINKO),
        addedInt16Field : leaf('Int16', -31945),
        boolList : leaf(
            'BoolList',
            [false, true, false].map(leafize('Bool'))
        )
    })),

    voidList : leaf('VoidWrapList', []),
    boolList : leaf('BoolList', []),
    int8List : leaf('Int8WrapList', []),
    int16List : leaf('Int16WrapList', []),
    int32List : leaf('Int32WrapList', []),
    int64List : leaf('Int64WrapList', []),
    uint8List : leaf('UInt8WrapList', []),
    uint16List : leaf('UInt16WrapList', []),
    uint32List : leaf('UInt32WrapList', []),
    uint64List : leaf('UInt64WrapList', []),
    float32List : leaf('Float32WrapList', []),
    float64List : leaf('Float64WrapList', []),
    textList : leaf('UpgradeTextList', []),
    dataList : leaf('UpgradeDataList', []),
    structList : leaf('SecondStructList', []),
    enumList : leaf('SecondEnumWrapList', []),
    addedStructList : leaf(
        'UpgradeSecondStructList',
        [{
            int8Field : leaf('Int8', -120),
            enumField : leaf('SecondEnum', reader.SecondEnum.QUATRO),
            textList : leaf(
                'TextList',
                ['asdf', 'qwerty']
                    .map(leafize('Text'))
            )
        }  ].map(priorize)
            .map(leafize('SecondStruct'))
            .map(upgrade('UpgradeSecondStruct'))
    ),
    addedEnumList : leaf('SecondEnumWrapList', []),
    addedTextList : leaf(
        'UpgradeTextList',
        ['first', 'second', 'third']
            .map(leafize('Text'))
            .map(upgrade('UpgradeText'))
    ),
    addedInt8List : leaf(
        'Int8WrapList',
        [1, -93, 4].map(leafize('Int8')).map(wrap).map(leafize('Int8Wrap'))
    )
}));

function assertEq(capnp, struct) {
    function list(capnp, ell) {
        switch (ell.type) {
        case 'VoidList':
        case 'BoolList':
        case 'Int8List':
        case 'Int16List':
        case 'Int32List':
        case 'UInt8List':
        case 'UInt16List':
        case 'UInt32List':
        case 'Float64List':
        case 'FirstEnumList':
        case 'SecondEnumList':
            capnp.forEach(function (v, i) {
                assert.strictEqual(v, ell.value[i].value);
            });
            break;

        case 'Int64List':
        case 'UInt64List':
            capnp.forEach(function (v, i) {
                assert.strictEqual(v[0], ell.value[i].value[0]);
                assert.strictEqual(v[1], ell.value[i].value[1]);
            });
            break;

        case 'Float32List':
            capnp.forEach(function (v, i) {
                var arr = new Float32Array(1);
                arr[0] = ell.value[i].value;
                assert.strictEqual(v, arr[0]);
            });
            break;

        case 'TextList':
            capnp.forEach(function (v, i) {
                assert.strictEqual(v.toString(), ell.value[i].value);
            });
            break;

        case 'DataList':
            capnp.forEach(function (v, i) {
                assert.deepEqual(v.raw(), ell.value[i].value);
            });
            break;

        case 'FirstStructList':
        case 'SecondStructList':
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
        case 'SecondEnumWrapList':
        case 'UpgradeDataList':
        case 'UpgradeTextList':
        case 'UpgradeSecondStructList':
            capnp.forEach(function (v, i) {
                assertEq(v, ell.value[i].value);
            });
            break;

        case 'AnyList':
            if (ell.value.length > 0)
                throw new Error('Cannot assert AnyPointer equivalence');
            break;

        default:
            throw new Error('Unhandled assertion value: '+ell.type);
        }

        assert.strictEqual(capnp.length(), ell.value.length);
    }

    for (var k in struct) {
        var suffix = k[0].toUpperCase() + k.slice(1);

        var c;
        var f = struct[k];
        switch (f.type) {
        case 'Void':
        case 'Bool':
        case 'Int8':
        case 'Int16':
        case 'Int32':
        case 'UInt8':
        case 'UInt16':
        case 'UInt32':
        case 'Float64':
        case 'FirstEnum':
        case 'SecondEnum':
            c = capnp['get'+suffix]();
            assert.strictEqual(c, f.value);
            break;

        case 'Int64':
        case 'UInt64':
            c = capnp['get'+suffix]();
            assert.strictEqual(c[0], f.value[0]);
            assert.strictEqual(c[1], f.value[1]);
            break;

        case 'Float32':
            c = capnp['get'+suffix]();
            var arr = new Float32Array(1);
            arr[0] = f.value;
            assert.strictEqual(c, arr[0]);
            break;

        case 'Text':
            if (f.value === null) {
                assert(!capnp['has'+suffix]());
            } else {
                c = capnp['get'+suffix]();
                assert.strictEqual(c.toString(), f.value);
            }
            break;

        case 'Data':
            if (f.value === null) {
                assert(!capnp['has'+suffix]());
            } else {
                c = capnp['get'+suffix]();
                assert.deepEqual(c.raw(), f.value);
            }
            break;

        case 'FirstStruct':
        case 'SecondStruct':
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
        case 'UpgradeText':
        case 'UpgradeData':
        case 'UpgradeSecondStruct':
            if (f.value === null) {
                assert(!capnp['has'+suffix]());
            } else {
                c = capnp['get'+suffix]();
                assertEq(c, f.value);
            }
            break;

        case 'Group':
            c = capnp['get'+suffix]();
            assertEq(c, f.value);
            break;

        case 'AnyPointer':
            if (f.value === null) {
                assert(!capnp['has'+suffix]());
            } else {
                /*
                 * The data structures can support
                 * `anyField->somePointerParametrization`--switch on f.type to
                 * cast the AnyPointer, then continue recurring.
                 */
                throw new Error('Non-null AnyPointer found');
            }
            break;

        default:
            if (f.value === null) {
                assert(!capnp['has'+suffix]());
            } else {
                c = capnp['get'+suffix]();
                list(c, f);
            }
        }
    }
}

exports.validate = assertEq;

function inject(capnp, struct) {
    function list(capnp, ell) {
        switch (ell.type) {
        case 'VoidList':
            break;

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
        case 'FirstEnumList':
        case 'SecondEnumList':
            ell.value.forEach(function (f, i) { capnp.set(i, f.value); });
            break;

        case 'FirstStructList':
        case 'SecondStructList':
        case 'UpgradeSecondStructList':
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
        case 'UpgradeTextList':
        case 'UpgradeDataList':
        case 'SecondEnumWrapList':
        case 'AnyWrapList':
            capnp.forEach(function(item, i) {
                inject(item, ell.value[i].value);
            });
            break;

        case 'AnyList':
            ell.value.forEach(function (f, i) { capnp.set(i, f.value); });
            break;

        default:
            throw new Error('Unhandled injection value: '+f.type);
        }
    }

    for (var k in struct) {
        var suffix = k[0].toUpperCase() + k.slice(1);
        var f = struct[k];
        switch (f.type) {
        case 'Void':
            break;

        case 'Bool':
        case 'Int8':
        case 'Int16':
        case 'Int32':
        case 'Int64':
        case 'UInt8':
        case 'UInt16':
        case 'UInt32':
        case 'UInt64':
        case 'Float32':
        case 'Float64':
        case 'FirstEnum':
        case 'SecondEnum':
            capnp['set'+suffix](f.value);
            break;

        case 'Text':
        case 'Data':
            if (f.value !== null) capnp['set'+suffix](f.value);
            break;

        case 'AnyPointer':
            if (f.value !== null) throw new Error('Non-null AnyPointer found');
            break;

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
        case 'UpgradeText':
        case 'UpgradeData':
            if (f.value !== null) inject(capnp['get'+suffix](), f.value);
            break;

        default:
            if (f.value !== null) list(capnp['init'+suffix](f.value.length), f);
        }
    }

    return capnp;
}

exports.inject = inject;

var firstSf = {
    boolField : leaf('Bool', false),
    int8Field : leaf('Int8', -102),
    int16Field : leaf('Int16', 21821),
    int32Field : leaf('Int32', -1834298),
    int64Field : leaf('Int64', [293834,11284742]),
    uint8Field : leaf('UInt8', 10),
    uint16Field : leaf('UInt16', 31103),
    uint32Field : leaf('UInt32', 1938484),
    uint64Field : leaf('UInt64', [19838492,12093022]),
    float32Field : leaf('Float32', 1903.444),
    float64Field : leaf('Float64', 12.422333),
    textField : leaf('Text', 'Inner Text Field'),
    dataField : leaf('Data', (function () {
        var b = new Buffer(200);
        b.fill(0);
        return b;
    })()), // Make child + its data larger than root as a test precondition
    enumField : leaf('FirstEnum', reader.FirstEnum.DOS),

    int32List : leaf('Int32List', [0, 8008, 0, -93445].map(leafize('Int32'))),
    enumList : leaf('FirstEnumList', [reader.FirstEnum.UNO, reader.FirstEnum.TRES, reader.FirstEnum.UNO].map(leafize('FirstEnum'))),
};

exports.first = {
    boolField : leaf('Bool', true),
    int8Field : leaf('Int8', -121),
    int16Field : leaf('Int16', -31033),
    int32Field : leaf('Int32', -1148542),
    int64Field : leaf('Int64', [-100,82933]),
    uint8Field : leaf('UInt8', 204),
    uint16Field : leaf('UInt16', 62958),
    uint32Field : leaf('UInt32', 2046733),
    uint64Field : leaf('UInt64', [243332333,4958585]),
    float32Field : leaf('Float32', 34.4945),
    float64Field : leaf('Float64', -1994398.344),
    textField : leaf('Text', 'Qwert Asdf'),
    dataField : leaf('Data', new Buffer([113, 119, 101, 120])),
    structField : leaf('FirstStruct', firstSf),
    enumField : leaf('FirstEnum', reader.FirstEnum.TRES),

    voidList : leaf('VoidList', [null, null, null, null, null].map(leafize('Void'))),
    boolList : leaf('BoolList', [true, false, true, true].map(leafize('Bool'))),
    int8List : leaf('Int8List', [0, 98, -23, 0].map(leafize('Int8'))),
    int16List : leaf('Int16List', [0, -29848, 0, 3494].map(leafize('Int16'))),
    int32List : leaf('Int32List', [0, -928484, -2945, 21245].map(leafize('Int32'))),
    int64List : leaf('Int64List', [[1233494595,932676333], [0,0], [1344,567775]].map(leafize('Int64'))),
    uint8List : leaf('UInt8List', [239, 0, 10, 103].map(leafize('UInt8'))),
    uint16List : leaf('UInt16List', [0, 39844, 6].map(leafize('UInt16'))),
    uint32List : leaf('UInt32List', [0, 2093827631, 44].map(leafize('UInt32'))),
    uint64List : leaf('UInt64List', [[2943,9183], [0,0], [1393994,1145566]].map(leafize('UInt64'))),
    float32List : leaf('Float32List', [1.4848, -0.595933, 0.003455532].map(leafize('Float32'))),
    float64List : leaf('Float64List', [92.3333211243, -2239.44242444, 3543.793993].map(leafize('Float64'))),
    textList : leaf('TextList', ['`outerSet` list text at 0', '`outerSet` list text at 1', 'one more text-list member'].map(leafize('Text'))),
    dataList : leaf('DataList', [new Buffer([97, 115, 100, 102]), new Buffer(0), new Buffer(0)].map(leafize('Data'))),
    enumList : leaf('FirstEnumList', [reader.FirstEnum.UNO, reader.FirstEnum.DOS, reader.FirstEnum.UNO].map(leafize('FirstEnum'))),
};

var secondSf = ramda.mixin(priorize(firstSf), priorize({
    enumField : leaf('SecondEnum', reader.SecondEnum.DOS),
    int32List : leaf(
        'Int32WrapList',
        firstSf.int32List.value.map(wrap).map(leafize('Int32Wrap'))
    ),
    enumList : leaf(
        'SecondEnumWrapList',
        [reader.SecondEnum.UNO, reader.SecondEnum.TRES, reader.SecondEnum.UNO]
            .map(leafize('SecondEnumWrap'))
    ),

    addedInt16Field : leaf('Int16', 194),
    addedEnumField : leaf('SecondEnum', reader.SecondEnum.UNO),

    addedEnumList : leaf(
        'SecondEnumWrapList',
        [reader.SecondEnum.DOS, reader.SecondEnum.TRES, reader.SecondEnum.QUATRO]
            .map(leafize('SecondEnumWrap'))
    ),
    addedTextList : leaf(
        'UpgradeTextList',
        ['1', '2', '3']
            .map(leafize('Text'))
            .map(upgrade('UpgradeText'))
    ),
    addedInt8List : leaf(
        'Int8WrapList',
        [1, 2, 43, -34].map(leafize('Int8')).map(wrap).map(leafize('Int8Wrap'))
    )
}));

exports.second = ramda.mixin(priorize(exports.first), priorize({
    // Override the upgraded types
    enumField : leaf('SecondEnum', exports.first.enumField.value),
    structField : leaf('SecondStruct', secondSf),

    voidList : leaf(
        'VoidWrapList',
        exports.first.voidList.value.map(wrap).map(leafize('VoidWrap'))
    ),
    int8List : leaf(
        'Int8WrapList',
        exports.first.int8List.value.map(wrap).map(leafize('Int8Wrap'))
    ),
    int16List : leaf(
        'Int16WrapList',
        exports.first.int16List.value.map(wrap).map(leafize('Int16Wrap'))
    ),
    int32List : leaf(
        'Int32WrapList',
        exports.first.int32List.value.map(wrap).map(leafize('Int32Wrap'))
    ),
    int64List : leaf(
        'Int64WrapList',
        exports.first.int64List.value.map(wrap).map(leafize('Int64Wrap'))
    ),
    uint8List : leaf(
        'UInt8WrapList',
        exports.first.uint8List.value.map(wrap).map(leafize('UInt8Wrap'))
    ),
    uint16List : leaf(
        'UInt16WrapList',
        exports.first.uint16List.value.map(wrap).map(leafize('UInt16Wrap'))
    ),
    uint32List : leaf(
        'UInt32WrapList',
        exports.first.uint32List.value.map(wrap).map(leafize('UInt32Wrap'))
    ),
    uint64List : leaf(
        'UInt64WrapList',
        exports.first.uint64List.value.map(wrap).map(leafize('UInt64Wrap'))
    ),
    float32List : leaf(
        'Float32WrapList',
        exports.first.float32List.value.map(wrap).map(leafize('Float32Wrap'))
    ),
    float64List : leaf(
        'Float64WrapList',
        exports.first.float64List.value.map(wrap).map(leafize('Float64Wrap'))
    ),
    enumList : leaf(
        'SecondEnumWrapList',
        [reader.SecondEnum.UNO, reader.SecondEnum.DOS, reader.SecondEnum.UNO]
            .map(leafize('SecondEnumWrap'))
    ),

    addedInt16Field : leaf('Int16', -9194),
    addedEnumField : leaf('SecondEnum', reader.SecondEnum.SINKO),

    addedEnumList : leaf(
        'SecondEnumWrapList',
        [reader.SecondEnum.UNO, reader.SecondEnum.TRES, reader.SecondEnum.DOS]
            .map(leafize('SecondEnumWrap'))
    ),
    addedTextList : leaf(
        'UpgradeTextList',
        ['not first', 'not second', 'not third', 'not fourth', 'not fifth']
            .map(leafize('Text'))
            .map(upgrade('UpgradeText'))
    ),
    addedInt8List : leaf(
        'Int8WrapList',
        [6, -94, -103, 3].map(leafize('Int8')).map(wrap).map(leafize('Int8Wrap'))
    )
}));
