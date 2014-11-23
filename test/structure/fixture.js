var assert = require('assert');
var ramda = require('ramda');

var reader = require('../testing.capnp.d/readers');

exports.firstDefaults = {
    voidField : null,
    boolField : false,
    int8Field : 0,
    int16Field : 0,
    int32Field : 0,
    int64Field : [0,0],
    uint8Field : 0,
    uint16Field : 0,
    uint32Field : 0,
    uint64Field : [0,0],
    float32Field : 0.0,
    float64Field : 0.0,
    textField : '',
    dataField : new Buffer(0),
    // structField : ,
    enumField : reader.FirstEnum.UNO,
    // anyField : ,
    voidList : [],
    boolList : [],
    int8List : [],
    int16List : [],
    int32List : [],
    int64List : [],
    uint8List : [],
    uint16List : [],
    uint32List : [],
    uint64List : [],
    float32List : [],
    float64List : [],
    textList : [],
    dataList : [],
    structList : [],
    enumList : [],
    anyList : []
};

exports.secondDefaults = ramda.mixin(exports.firstDefaults, {
    addedInt16Field : -32015,
    addedEnumField : reader.SecondEnum.QUATRO,
    // addedStructField : ,
    addedStructList : [],
    addedEnumList : [],
    addedTextList : ['first', 'second'],
    addedInt8List : [1,-93]
});

var listStrictAssert = function (capnp, ell) {
    assert.strictEqual(capnp.length(), ell.length);
    capnp.forEach(function (d, i) { assert.strictEqual(d, ell[i]); });
};

var listDeepAssert = function (capnp, ell) {
    assert.strictEqual(capnp.length(), ell.length);
    capnp.forEach(function (d, i) { assert.deepEqual(d, ell[i]); });
};

var listDataAssert = function (capnp, ell) {
    assert.strictEqual(capnp.length(), ell.length);
    capnp.forEach(function (d, i) { assert.deepEqual(d.raw(), ell[i]); });
};

var listTextAssert = function (capnp, ell) {
    assert.strictEqual(capnp.length(), ell.length);
    capnp.forEach(function (d, i) { assert.strictEqual(d.toString(), ell[i]); });
};

var listF32Assert = function (capnp, ell) {
    assert.strictEqual(capnp.length(), ell.length);
    var ta = new Float32Array(1);
    capnp.forEach(function (d, i) {
        ta[0] = ell[i];
        assert.strictEqual(d, ta[0]);
    });
};

var listF64Assert = function (capnp, ell) {
    assert.strictEqual(capnp.length(), ell.length);
    var ta = new Float64Array(1);
    capnp.forEach(function (d, i) {
        ta[0] = ell[i];
        assert.strictEqual(d, ta[0]);
    });
};

exports.firstValidate = function (root, values) {
    // Handle `anyField` and `structField` externally.
    assert.strictEqual(root.getVoidField(), values.voidField);
    assert.strictEqual(root.getBoolField(), values.boolField);
    assert.strictEqual(root.getInt8Field(), values.int8Field);
    assert.strictEqual(root.getInt16Field(), values.int16Field);
    assert.strictEqual(root.getInt32Field(), values.int32Field);
    assert.deepEqual(root.getInt64Field(), values.int64Field);
    assert.strictEqual(root.getUint8Field(), values.uint8Field);
    assert.strictEqual(root.getUint16Field(), values.uint16Field);
    assert.strictEqual(root.getUint32Field(), values.uint32Field);
    assert.deepEqual(root.getUint64Field(), values.uint64Field);
    assert.strictEqual(root.getFloat32Field(), (function () {
        var ta = new Float32Array(1);
        ta[0] = values.float32Field;
        return ta[0];
    })());
    assert.strictEqual(root.getFloat64Field(), (function () {
        var ta = new Float64Array(1);
        ta[0] = values.float64Field;
        return ta[0];
    })());
    assert.strictEqual(root.getTextField().toString(), values.textField);
    assert.deepEqual(root.getDataField().raw(), values.dataField);
    assert.strictEqual(root.getEnumField(), values.enumField);

    // Handle `structList` and `anyList` externally.
    listStrictAssert(root.getVoidList(), values.voidList);
    listStrictAssert(root.getBoolList(), values.boolList);
    listStrictAssert(root.getInt8List(), values.int8List);
    listStrictAssert(root.getInt16List(), values.int16List);
    listStrictAssert(root.getInt32List(), values.int32List);
    listDeepAssert(root.getInt64List(), values.int64List);
    listStrictAssert(root.getUint8List(), values.uint8List);
    listStrictAssert(root.getUint16List(), values.uint16List);
    listStrictAssert(root.getUint32List(), values.uint32List);
    listDeepAssert(root.getUint64List(), values.uint64List);
    listF32Assert(root.getFloat32List(), values.float32List);
    listF64Assert(root.getFloat64List(), values.float64List);
    listTextAssert(root.getTextList(), values.textList);
    listDataAssert(root.getDataList(), values.dataList);
    listStrictAssert(root.getEnumList(), values.enumList);
};

exports.secondValidate = function (root, values) {
    exports.firstValidate(root, values);

    assert.strictEqual(root.getAddedInt16Field(), values.addedInt16Field);
    assert.strictEqual(root.getAddedEnumField(), values.addedEnumField);

    listStrictAssert(root.getAddedEnumList(), values.addedEnumList);
    listTextAssert(root.getAddedTextList(), values.addedTextList);
    listStrictAssert(root.getAddedInt8List(), values.addedInt8List);
};

exports.firstInject = function (base, values) {
    base.setBoolField(values.boolField);
    base.setInt8Field(values.int8Field);
    base.setInt16Field(values.int16Field);
    base.setInt32Field(values.int32Field);
    base.setInt64Field(values.int64Field);
    base.setUint8Field(values.uint8Field);
    base.setUint16Field(values.uint16Field);
    base.setUint32Field(values.uint32Field);
    base.setUint64Field(values.uint64Field);
    base.setFloat32Field(values.float32Field);
    base.setFloat64Field(values.float64Field);
    base.setTextField(values.textField);
    base.setDataField(values.dataField);
    if (values.structField) base.setStructField(values.structField);
    base.setEnumField(values.enumField);
    if (values.anyField) base.setAnyField(values.anyField);

    var ell;

    ell = base.initVoidList(values.voidList.length);

    ell = base.initBoolList(values.boolList.length);
    values.boolList.forEach(function (v, i) { ell.set(i, v); });

    ell = base.initInt8List(values.int8List.length);
    values.int8List.forEach(function (v, i) { ell.set(i, v); });

    ell = base.initInt16List(values.int16List.length);
    values.int16List.forEach(function (v, i) { ell.set(i, v); });

    ell = base.initInt32List(values.int32List.length);
    values.int32List.forEach(function (v, i) { ell.set(i, v); });

    ell = base.initInt64List(values.int64List.length);
    values.int64List.forEach(function (v, i) { ell.set(i, v); });

    ell = base.initUint8List(values.uint8List.length);
    values.uint8List.forEach(function (v, i) { ell.set(i, v); });

    ell = base.initUint16List(values.uint16List.length);
    values.uint16List.forEach(function (v, i) { ell.set(i, v); });

    ell = base.initUint32List(values.uint32List.length);
    values.uint32List.forEach(function (v, i) { ell.set(i, v); });

    ell = base.initUint64List(values.uint64List.length);
    values.uint64List.forEach(function (v, i) { ell.set(i, v); });

    ell = base.initFloat32List(values.float32List.length);
    values.float32List.forEach(function (v, i) { ell.set(i, v); });

    ell = base.initFloat64List(values.float64List.length);
    values.float64List.forEach(function (v, i) { ell.set(i, v); });

    ell = base.initTextList(values.textList.length);
    values.textList.forEach(function (v, i) { ell.set(i, v); });

    ell = base.initDataList(values.dataList.length);
    values.dataList.forEach(function (v, i) { ell.set(i, v); });

    ell = base.initStructList(values.structList.length);
    values.structList.forEach(function (v, i) { ell.set(i, v); });

    ell = base.initEnumList(values.enumList.length);
    values.enumList.forEach(function (v, i) { ell.set(i, v); });

    ell = base.initAnyList(values.anyList.length);
    values.anyList.forEach(function (v, i) { ell.set(i, v); });

    return base;
};

exports.secondInject = function (base, values) {
    exports.firstInject(base, values);

    base.setAddedInt16Field(values.addedInt16Field);
    base.setAddedEnumField(values.addedEnumField);
    if (values.addedStructField) base.setAddedStructField(values.addedStructField);

    var ell;

    ell = base.initAddedStructList(values.addedStructList.length);
    values.addedStructList.forEach(function (v, i) { ell.set(i, v); });

    ell = base.initAddedEnumList(values.addedEnumList.length);
    values.addedEnumList.forEach(function (v, i) { ell.set(i, v); });

    ell = base.initAddedTextList(values.addedTextList.length);
    values.addedTextList.forEach(function (v, i) { ell.set(i, v); });

    ell = base.initAddedInt8List(values.addedInt8List.length);
    values.addedInt8List.forEach(function (v, i) { ell.set(i, v); });

    return base;
};

exports.firstRoot = ramda.mixin(exports.firstDefaults, {
    boolField : true,
    int8Field : -121,
    int16Field : -31033,
    int32Field : -1148542,
    int64Field : [-100,82933],
    uint8Field : 204,
    uint16Field : 62958,
    uint32Field : 2046733,
    uint64Field : [243332333,4958585],
    float32Field : 34.4945,
    float64Field : -1994398.344,
    textField : 'Qwert Asdf',
    dataField : new Buffer([0x71, 0x77, 0x65, 0x72]),
    enumField : reader.FirstEnum.TRES,

    voidList : [null, null],
    boolList : [true, false],
    int8List : [0, 98],
    int16List : [0, -29848],
    int32List : [0, -928484],
    int64List : [[1233494595,932676333], [0,0]],
    uint8List : [239, 0],
    uint16List : [0, 39844],
    uint32List : [0, 2093827631],
    uint64List : [[2943,9183], [0,0]],
    float32List : [1.4848, -0.595933],
    float64List : [92.3333211243, -2239.44242444],
    textList : ['`outerSet` list text at 0', '`outerSet` list text at 1'],
    dataList : [new Buffer([0x61, 0x73, 0x64, 0x66]), new Buffer(0), new Buffer(0)],
    enumList : [reader.FirstEnum.UNO, reader.FirstEnum.DOS],
});

exports.firstSf = ramda.mixin(exports.firstDefaults, {
    boolField : false,
    int8Field : -102,
    int16Field : 21821,
    int32Field : -1834298,
    int64Field : [293834,11284742],
    uint8Field : 10,
    uint16Field : 31103,
    uint32Field : 1938484,
    uint64Field : [19838492,12093022],
    float32Field : 1903.444,
    float64Field : 12.422333,
    textField : 'Inner Text Field',
    dataField : new Buffer([0x74, 0x6d, 0x69]),
    enumField : reader.FirstEnum.DOS,

    int32List : [0, 8008, 0, -93445]
});

exports.secondRoot = ramda.mixin(exports.secondDefaults, exports.firstRoot);
exports.secondRoot = ramda.mixin(exports.secondRoot, {
    addedInt16Field : -9194,
    addedEnumField : reader.SecondEnum.SINKO,

    addedEnumList : [reader.SecondEnum.UNO, reader.SecondEnum.TRES, reader.SecondEnum.DOS],
    addedTextList : ["not first", "not second"],
    addedInt8List : [6, -94]
});

exports.secondSf = ramda.mixin(exports.secondDefaults, exports.firstSf);
exports.secondSf = ramda.mixin(exports.secondSf, {
    addedInt16Field : 194,
    addedEnumField : reader.SecondEnum.UNO,

    addedEnumList : [reader.SecondEnum.DOS, reader.SecondEnum.TRES, reader.SecondEnum.QUATRO],
    addedTextList : ["1", "2"],
    addedInt8List : [1, 2, 43]
});
