var Allocator = require('capnp-js/builder/Allocator');
var builder = require('capnp-js/builder/index');
var reader = require('capnp-js/reader/index');
var scope = require('./bScope');
var readers = require('./readers');
    var builders = {};
    var allocator = new Allocator();
    builders.WrapAny = (function() {
        var Structure = scope["0xea60082ed1eb69e6"];
        Structure.prototype.getAnyField = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 0
            };
            return builder.AnyPointer._deref(this._arena, pointer);
        };
        Structure.prototype.setAnyField = function(value) {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 0
            };
            builder.AnyPointer._set(this._arena, pointer, value);
        };
        Structure.prototype.adoptAnyField = function(value) {
            if (builder.AnyPointerBlob._TYPE !== value._TYPE) {
                throw new TypeError();
            }
            if (!value._isDisowned) {
                throw new ValueError('Attempted to adopt an AnyPointerBlob a second time');
            }
            builder.AnyPointerBlob._adopt(this._arena, {
                segment: this._segment,
                position: this._pointersSection + 0
            }, value);
        };
        Structure.prototype.disownAnyField = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 0
            };
            var instance = new builder.AnyPointerBlob(this._arena, pointer);
            this._arena._zero(pointer, 8);
            return instance;
        };
        Structure.prototype._defaults = Structure._READER.prototype._defaults;
        return Structure;
    })();
    builders.FirstEnum = readers.FirstEnum;
    builders.FirstStruct = (function() {
        var Structure = scope["0xd060e5f1a09c1c42"];
        Structure.prototype.getVoidField = function() {
            return null;
        };
        Structure.prototype.setVoidField = function() {};
        Structure.prototype.getBoolField = function() {
            var position = this._dataSection + 0;
            return reader.fields.bool(0, this._segment, position, 0);
        };
        Structure.prototype.setBoolField = function(value) {
            var position = this._dataSection + 0;
            builder.fields.bool(value, 0, this._segment, position, 0);
        };
        Structure.prototype.getInt8Field = function() {
            var position = this._dataSection + 1;
            return reader.fields.int8(0, this._segment, position);
        };
        Structure.prototype.setInt8Field = function(value) {
            builder.fields.int8(value, 0, this._segment, this._dataSection + 1);
        };
        Structure.prototype.getInt16Field = function() {
            var position = this._dataSection + 2;
            return reader.fields.int16(0, this._segment, position);
        };
        Structure.prototype.setInt16Field = function(value) {
            builder.fields.int16(value, 0, this._segment, this._dataSection + 2);
        };
        Structure.prototype.getInt32Field = function() {
            var position = this._dataSection + 4;
            return reader.fields.int32(0, this._segment, position);
        };
        Structure.prototype.setInt32Field = function(value) {
            builder.fields.int32(value, 0, this._segment, this._dataSection + 4);
        };
        Structure.prototype.getInt64Field = function() {
            var position = this._dataSection + 8;
            return reader.fields.int64([0, 0], this._segment, position);
        };
        Structure.prototype.setInt64Field = function(value) {
            builder.fields.int64(value, [0, 0], this._segment, this._dataSection + 8);
        };
        Structure.prototype.getUint8Field = function() {
            var position = this._dataSection + 16;
            return reader.fields.uint8(0, this._segment, position);
        };
        Structure.prototype.setUint8Field = function(value) {
            builder.fields.uint8(value, 0, this._segment, this._dataSection + 16);
        };
        Structure.prototype.getUint16Field = function() {
            var position = this._dataSection + 18;
            return reader.fields.uint16(0, this._segment, position);
        };
        Structure.prototype.setUint16Field = function(value) {
            builder.fields.uint16(value, 0, this._segment, this._dataSection + 18);
        };
        Structure.prototype.getUint32Field = function() {
            var position = this._dataSection + 20;
            return reader.fields.uint32(0, this._segment, position);
        };
        Structure.prototype.setUint32Field = function(value) {
            builder.fields.uint32(value, 0, this._segment, this._dataSection + 20);
        };
        Structure.prototype.getUint64Field = function() {
            var position = this._dataSection + 24;
            return reader.fields.uint64([0, 0], this._segment, position);
        };
        Structure.prototype.setUint64Field = function(value) {
            builder.fields.uint64(value, [0, 0], this._segment, this._dataSection + 24);
        };
        Structure.prototype.getFloat32Field = function() {
            var position = this._dataSection + 32;
            return reader.fields.float32(this._defaults.float32Field, this._segment, position);
        };
        Structure.prototype.setFloat32Field = function(value) {
            var position = this._dataSection + 32;
            builder.fields.float32(value, this._defaults.float32Field, this._segment, position);
        };
        Structure.prototype.getFloat64Field = function() {
            var position = this._dataSection + 40;
            return reader.fields.float64(this._defaults.float64Field, this._segment, position);
        };
        Structure.prototype.setFloat64Field = function(value) {
            var position = this._dataSection + 40;
            builder.fields.float64(value, this._defaults.float64Field, this._segment, position);
        };
        Structure.prototype.getTextField = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 0
            };
            if (reader.isNull(pointer)) {
                builder.copy.pointer.setListPointer(this._defaults.textField._arena, this._defaults.textField._layout(), this._arena, pointer);
            }
            return builder.Text._deref(this._arena, pointer);
        };
        Structure.prototype.setTextField = function(value) {
            var params = builder.Text._setParams(value);
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 0
            };
            builder.Text._set(this._arena, pointer, params);
        };
        Structure.prototype.initTextField = function(n) {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 0
            };
            return builder.Text._init(this._arena, pointer, n + 1);
        };
        Structure.prototype.hasTextField = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 0
            };
            return (!reader.isNull(pointer));
        };
        Structure.prototype.adoptTextField = function(value) {
            if (builder.Text._TYPE !== value._TYPE) {
                throw new TypeError();
            }
            builder.Text._adopt(this._arena, {
                segment: this._segment,
                position: this._pointersSection + 0
            }, value);
        };
        Structure.prototype.disownTextField = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 0
            };
            if (reader.isNull(pointer)) {
                return builder.Text._initOrphan(this._arena);
            } else {
                var instance = builder.Text._deref(this._arena, pointer);
                this._arena._zero(pointer, 8);
                instance._isDisowned = true;
                return instance;
            }
        };
        Structure.prototype.getDataField = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 8
            };
            if (reader.isNull(pointer)) {
                builder.copy.pointer.setListPointer(this._defaults.dataField._arena, this._defaults.dataField._layout(), this._arena, pointer);
            }
            return builder.Data._deref(this._arena, pointer);
        };
        Structure.prototype.setDataField = function(value) {
            var params = builder.Data._setParams(value);
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 8
            };
            builder.Data._set(this._arena, pointer, params);
        };
        Structure.prototype.initDataField = function(n) {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 8
            };
            return builder.Data._init(this._arena, pointer, n);
        };
        Structure.prototype.hasDataField = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 8
            };
            return (!reader.isNull(pointer));
        };
        Structure.prototype.adoptDataField = function(value) {
            if (builder.Data._TYPE !== value._TYPE) {
                throw new TypeError();
            }
            builder.Data._adopt(this._arena, {
                segment: this._segment,
                position: this._pointersSection + 8
            }, value);
        };
        Structure.prototype.disownDataField = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 8
            };
            if (reader.isNull(pointer)) {
                return builder.Data._initOrphan(this._arena);
            } else {
                var instance = builder.Data._deref(this._arena, pointer);
                this._arena._zero(pointer, 8);
                instance._isDisowned = true;
                return instance;
            }
        };
        var Builder_structField = scope["0xd060e5f1a09c1c42"];
        Structure.prototype.initStructField = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 16
            };
            return Builder_structField._init(this._arena, pointer, this._depth + 1);
        };
        Structure.prototype.getStructField = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 16
            };
            if (reader.isNull(pointer)) {
                builder.copy.pointer.setStructPointer(this._defaults.structField._arena, this._defaults.structField._layout(), this._arena, pointer);
            }
            return Builder_structField._deref(this._arena, pointer);
        };
        Structure.prototype.setStructField = function(value) {
            if (Builder_structField._TYPE !== value._TYPE) throw new TypeError();
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 16
            };
            Builder_structField._set(this._arena, pointer, value);
        };
        Structure.prototype.adoptStructField = function(value) {
            if (Builder_structField._TYPE !== value._TYPE) throw new TypeError();
            if (!value._isOrphan) throw new ValueError('Cannot adopt non-orphans');
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 16
            };
            Builder_structField._adopt(this._arena, pointer, value);
        };
        Structure.prototype.disownStructField = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 16
            };
            if (reader.isNull(pointer)) {
                return Builder_structField._initOrphan(this._arena);
            } else {
                var instance = Builder_structField._deref(this._arena, pointer);
                this._arena._zero(pointer, 8);
                instance._isOrphan = true;
                return instance;
            }
        };
        Structure.prototype.disownAsReaderStructField = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 16
            };
            var instance = Builder_structField._READER._deref(this._arena, pointer);
            this._arena._zero(pointer, 8);
            instance._isOrphan = true;
            return instance;
        };
        Structure.prototype.hasStructField = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 16
            };
            return (!reader.isNull(pointer));
        };
        Structure.prototype.getEnumField = function() {
            var position = this._dataSection + 36;
            return reader.fields.uint16(0, this._segment, position);
        };
        Structure.prototype.setEnumField = function(value) {
            builder.fields.uint16(value, 0, this._segment, this._dataSection + 36);
        };
        Structure.prototype.getAnyField = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 24
            };
            return builder.AnyPointer._deref(this._arena, pointer);
        };
        Structure.prototype.setAnyField = function(value) {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 24
            };
            builder.AnyPointer._set(this._arena, pointer, value);
        };
        Structure.prototype.adoptAnyField = function(value) {
            if (builder.AnyPointerBlob._TYPE !== value._TYPE) {
                throw new TypeError();
            }
            if (!value._isDisowned) {
                throw new ValueError('Attempted to adopt an AnyPointerBlob a second time');
            }
            builder.AnyPointerBlob._adopt(this._arena, {
                segment: this._segment,
                position: this._pointersSection + 24
            }, value);
        };
        Structure.prototype.disownAnyField = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 24
            };
            var instance = new builder.AnyPointerBlob(this._arena, pointer);
            this._arena._zero(pointer, 8);
            return instance;
        };
        var Builder_voidList = builder.lists.Void;
        Structure.prototype.initVoidList = function(n) {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 32
            };
            return Builder_voidList._init(this._arena, pointer, n);
        };
        Structure.prototype.getVoidList = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 32
            };
            if (reader.isNull(pointer)) {
                builder.copy.pointer.setListPointer(this._defaults.voidList._arena, this._defaults.voidList._layout(), this._arena, pointer);
            }
            return Builder_voidList._deref(this._arena, pointer);
        };
        Structure.prototype.setVoidList = function(value) {
            if (Builder_voidList._TYPE !== value._TYPE) throw new TypeError();
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 32
            };
            Builder_voidList._set(this._arena, pointer, value);
        };
        Structure.prototype.adoptVoidList = function(value) {
            if (Builder_voidList._TYPE !== value._TYPE) throw new TypeError();
            if (!value._isOrphan) throw new ValueError('Cannot adopt non-orphans');
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 32
            };
            Builder_voidList._adopt(this._arena, pointer, value);
        };
        Structure.prototype.disownVoidList = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 32
            };
            if (reader.isNull(pointer)) {
                return Builder_voidList._initOrphan(this._arena);
            } else {
                var instance = Builder_voidList._deref(this._arena, pointer);
                this._arena._zero(pointer, 8);
                instance._isOrphan = true;
                return instance;
            }
        };
        Structure.prototype.disownAsReaderVoidList = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 32
            };
            var instance = Builder_voidList._READER._deref(this._arena, pointer);
            this._arena._zero(pointer, 8);
            instance._isOrphan = true;
            return instance;
        };
        Structure.prototype.hasVoidList = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 32
            };
            return (!reader.isNull(pointer));
        };
        var Builder_boolList = builder.lists.Bool;
        Structure.prototype.initBoolList = function(n) {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 40
            };
            return Builder_boolList._init(this._arena, pointer, n);
        };
        Structure.prototype.getBoolList = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 40
            };
            if (reader.isNull(pointer)) {
                builder.copy.pointer.setListPointer(this._defaults.boolList._arena, this._defaults.boolList._layout(), this._arena, pointer);
            }
            return Builder_boolList._deref(this._arena, pointer);
        };
        Structure.prototype.setBoolList = function(value) {
            if (Builder_boolList._TYPE !== value._TYPE) throw new TypeError();
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 40
            };
            Builder_boolList._set(this._arena, pointer, value);
        };
        Structure.prototype.adoptBoolList = function(value) {
            if (Builder_boolList._TYPE !== value._TYPE) throw new TypeError();
            if (!value._isOrphan) throw new ValueError('Cannot adopt non-orphans');
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 40
            };
            Builder_boolList._adopt(this._arena, pointer, value);
        };
        Structure.prototype.disownBoolList = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 40
            };
            if (reader.isNull(pointer)) {
                return Builder_boolList._initOrphan(this._arena);
            } else {
                var instance = Builder_boolList._deref(this._arena, pointer);
                this._arena._zero(pointer, 8);
                instance._isOrphan = true;
                return instance;
            }
        };
        Structure.prototype.disownAsReaderBoolList = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 40
            };
            var instance = Builder_boolList._READER._deref(this._arena, pointer);
            this._arena._zero(pointer, 8);
            instance._isOrphan = true;
            return instance;
        };
        Structure.prototype.hasBoolList = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 40
            };
            return (!reader.isNull(pointer));
        };
        var Builder_int8List = builder.lists.Int8;
        Structure.prototype.initInt8List = function(n) {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 48
            };
            return Builder_int8List._init(this._arena, pointer, n);
        };
        Structure.prototype.getInt8List = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 48
            };
            if (reader.isNull(pointer)) {
                builder.copy.pointer.setListPointer(this._defaults.int8List._arena, this._defaults.int8List._layout(), this._arena, pointer);
            }
            return Builder_int8List._deref(this._arena, pointer);
        };
        Structure.prototype.setInt8List = function(value) {
            if (Builder_int8List._TYPE !== value._TYPE) throw new TypeError();
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 48
            };
            Builder_int8List._set(this._arena, pointer, value);
        };
        Structure.prototype.adoptInt8List = function(value) {
            if (Builder_int8List._TYPE !== value._TYPE) throw new TypeError();
            if (!value._isOrphan) throw new ValueError('Cannot adopt non-orphans');
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 48
            };
            Builder_int8List._adopt(this._arena, pointer, value);
        };
        Structure.prototype.disownInt8List = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 48
            };
            if (reader.isNull(pointer)) {
                return Builder_int8List._initOrphan(this._arena);
            } else {
                var instance = Builder_int8List._deref(this._arena, pointer);
                this._arena._zero(pointer, 8);
                instance._isOrphan = true;
                return instance;
            }
        };
        Structure.prototype.disownAsReaderInt8List = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 48
            };
            var instance = Builder_int8List._READER._deref(this._arena, pointer);
            this._arena._zero(pointer, 8);
            instance._isOrphan = true;
            return instance;
        };
        Structure.prototype.hasInt8List = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 48
            };
            return (!reader.isNull(pointer));
        };
        var Builder_int16List = builder.lists.Int16;
        Structure.prototype.initInt16List = function(n) {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 56
            };
            return Builder_int16List._init(this._arena, pointer, n);
        };
        Structure.prototype.getInt16List = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 56
            };
            if (reader.isNull(pointer)) {
                builder.copy.pointer.setListPointer(this._defaults.int16List._arena, this._defaults.int16List._layout(), this._arena, pointer);
            }
            return Builder_int16List._deref(this._arena, pointer);
        };
        Structure.prototype.setInt16List = function(value) {
            if (Builder_int16List._TYPE !== value._TYPE) throw new TypeError();
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 56
            };
            Builder_int16List._set(this._arena, pointer, value);
        };
        Structure.prototype.adoptInt16List = function(value) {
            if (Builder_int16List._TYPE !== value._TYPE) throw new TypeError();
            if (!value._isOrphan) throw new ValueError('Cannot adopt non-orphans');
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 56
            };
            Builder_int16List._adopt(this._arena, pointer, value);
        };
        Structure.prototype.disownInt16List = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 56
            };
            if (reader.isNull(pointer)) {
                return Builder_int16List._initOrphan(this._arena);
            } else {
                var instance = Builder_int16List._deref(this._arena, pointer);
                this._arena._zero(pointer, 8);
                instance._isOrphan = true;
                return instance;
            }
        };
        Structure.prototype.disownAsReaderInt16List = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 56
            };
            var instance = Builder_int16List._READER._deref(this._arena, pointer);
            this._arena._zero(pointer, 8);
            instance._isOrphan = true;
            return instance;
        };
        Structure.prototype.hasInt16List = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 56
            };
            return (!reader.isNull(pointer));
        };
        var Builder_int32List = builder.lists.Int32;
        Structure.prototype.initInt32List = function(n) {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 64
            };
            return Builder_int32List._init(this._arena, pointer, n);
        };
        Structure.prototype.getInt32List = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 64
            };
            if (reader.isNull(pointer)) {
                builder.copy.pointer.setListPointer(this._defaults.int32List._arena, this._defaults.int32List._layout(), this._arena, pointer);
            }
            return Builder_int32List._deref(this._arena, pointer);
        };
        Structure.prototype.setInt32List = function(value) {
            if (Builder_int32List._TYPE !== value._TYPE) throw new TypeError();
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 64
            };
            Builder_int32List._set(this._arena, pointer, value);
        };
        Structure.prototype.adoptInt32List = function(value) {
            if (Builder_int32List._TYPE !== value._TYPE) throw new TypeError();
            if (!value._isOrphan) throw new ValueError('Cannot adopt non-orphans');
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 64
            };
            Builder_int32List._adopt(this._arena, pointer, value);
        };
        Structure.prototype.disownInt32List = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 64
            };
            if (reader.isNull(pointer)) {
                return Builder_int32List._initOrphan(this._arena);
            } else {
                var instance = Builder_int32List._deref(this._arena, pointer);
                this._arena._zero(pointer, 8);
                instance._isOrphan = true;
                return instance;
            }
        };
        Structure.prototype.disownAsReaderInt32List = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 64
            };
            var instance = Builder_int32List._READER._deref(this._arena, pointer);
            this._arena._zero(pointer, 8);
            instance._isOrphan = true;
            return instance;
        };
        Structure.prototype.hasInt32List = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 64
            };
            return (!reader.isNull(pointer));
        };
        var Builder_int64List = builder.lists.Int64;
        Structure.prototype.initInt64List = function(n) {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 72
            };
            return Builder_int64List._init(this._arena, pointer, n);
        };
        Structure.prototype.getInt64List = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 72
            };
            if (reader.isNull(pointer)) {
                builder.copy.pointer.setListPointer(this._defaults.int64List._arena, this._defaults.int64List._layout(), this._arena, pointer);
            }
            return Builder_int64List._deref(this._arena, pointer);
        };
        Structure.prototype.setInt64List = function(value) {
            if (Builder_int64List._TYPE !== value._TYPE) throw new TypeError();
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 72
            };
            Builder_int64List._set(this._arena, pointer, value);
        };
        Structure.prototype.adoptInt64List = function(value) {
            if (Builder_int64List._TYPE !== value._TYPE) throw new TypeError();
            if (!value._isOrphan) throw new ValueError('Cannot adopt non-orphans');
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 72
            };
            Builder_int64List._adopt(this._arena, pointer, value);
        };
        Structure.prototype.disownInt64List = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 72
            };
            if (reader.isNull(pointer)) {
                return Builder_int64List._initOrphan(this._arena);
            } else {
                var instance = Builder_int64List._deref(this._arena, pointer);
                this._arena._zero(pointer, 8);
                instance._isOrphan = true;
                return instance;
            }
        };
        Structure.prototype.disownAsReaderInt64List = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 72
            };
            var instance = Builder_int64List._READER._deref(this._arena, pointer);
            this._arena._zero(pointer, 8);
            instance._isOrphan = true;
            return instance;
        };
        Structure.prototype.hasInt64List = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 72
            };
            return (!reader.isNull(pointer));
        };
        var Builder_uint8List = builder.lists.UInt8;
        Structure.prototype.initUint8List = function(n) {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 80
            };
            return Builder_uint8List._init(this._arena, pointer, n);
        };
        Structure.prototype.getUint8List = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 80
            };
            if (reader.isNull(pointer)) {
                builder.copy.pointer.setListPointer(this._defaults.uint8List._arena, this._defaults.uint8List._layout(), this._arena, pointer);
            }
            return Builder_uint8List._deref(this._arena, pointer);
        };
        Structure.prototype.setUint8List = function(value) {
            if (Builder_uint8List._TYPE !== value._TYPE) throw new TypeError();
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 80
            };
            Builder_uint8List._set(this._arena, pointer, value);
        };
        Structure.prototype.adoptUint8List = function(value) {
            if (Builder_uint8List._TYPE !== value._TYPE) throw new TypeError();
            if (!value._isOrphan) throw new ValueError('Cannot adopt non-orphans');
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 80
            };
            Builder_uint8List._adopt(this._arena, pointer, value);
        };
        Structure.prototype.disownUint8List = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 80
            };
            if (reader.isNull(pointer)) {
                return Builder_uint8List._initOrphan(this._arena);
            } else {
                var instance = Builder_uint8List._deref(this._arena, pointer);
                this._arena._zero(pointer, 8);
                instance._isOrphan = true;
                return instance;
            }
        };
        Structure.prototype.disownAsReaderUint8List = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 80
            };
            var instance = Builder_uint8List._READER._deref(this._arena, pointer);
            this._arena._zero(pointer, 8);
            instance._isOrphan = true;
            return instance;
        };
        Structure.prototype.hasUint8List = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 80
            };
            return (!reader.isNull(pointer));
        };
        var Builder_uint16List = builder.lists.UInt16;
        Structure.prototype.initUint16List = function(n) {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 88
            };
            return Builder_uint16List._init(this._arena, pointer, n);
        };
        Structure.prototype.getUint16List = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 88
            };
            if (reader.isNull(pointer)) {
                builder.copy.pointer.setListPointer(this._defaults.uint16List._arena, this._defaults.uint16List._layout(), this._arena, pointer);
            }
            return Builder_uint16List._deref(this._arena, pointer);
        };
        Structure.prototype.setUint16List = function(value) {
            if (Builder_uint16List._TYPE !== value._TYPE) throw new TypeError();
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 88
            };
            Builder_uint16List._set(this._arena, pointer, value);
        };
        Structure.prototype.adoptUint16List = function(value) {
            if (Builder_uint16List._TYPE !== value._TYPE) throw new TypeError();
            if (!value._isOrphan) throw new ValueError('Cannot adopt non-orphans');
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 88
            };
            Builder_uint16List._adopt(this._arena, pointer, value);
        };
        Structure.prototype.disownUint16List = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 88
            };
            if (reader.isNull(pointer)) {
                return Builder_uint16List._initOrphan(this._arena);
            } else {
                var instance = Builder_uint16List._deref(this._arena, pointer);
                this._arena._zero(pointer, 8);
                instance._isOrphan = true;
                return instance;
            }
        };
        Structure.prototype.disownAsReaderUint16List = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 88
            };
            var instance = Builder_uint16List._READER._deref(this._arena, pointer);
            this._arena._zero(pointer, 8);
            instance._isOrphan = true;
            return instance;
        };
        Structure.prototype.hasUint16List = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 88
            };
            return (!reader.isNull(pointer));
        };
        var Builder_uint32List = builder.lists.UInt32;
        Structure.prototype.initUint32List = function(n) {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 96
            };
            return Builder_uint32List._init(this._arena, pointer, n);
        };
        Structure.prototype.getUint32List = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 96
            };
            if (reader.isNull(pointer)) {
                builder.copy.pointer.setListPointer(this._defaults.uint32List._arena, this._defaults.uint32List._layout(), this._arena, pointer);
            }
            return Builder_uint32List._deref(this._arena, pointer);
        };
        Structure.prototype.setUint32List = function(value) {
            if (Builder_uint32List._TYPE !== value._TYPE) throw new TypeError();
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 96
            };
            Builder_uint32List._set(this._arena, pointer, value);
        };
        Structure.prototype.adoptUint32List = function(value) {
            if (Builder_uint32List._TYPE !== value._TYPE) throw new TypeError();
            if (!value._isOrphan) throw new ValueError('Cannot adopt non-orphans');
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 96
            };
            Builder_uint32List._adopt(this._arena, pointer, value);
        };
        Structure.prototype.disownUint32List = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 96
            };
            if (reader.isNull(pointer)) {
                return Builder_uint32List._initOrphan(this._arena);
            } else {
                var instance = Builder_uint32List._deref(this._arena, pointer);
                this._arena._zero(pointer, 8);
                instance._isOrphan = true;
                return instance;
            }
        };
        Structure.prototype.disownAsReaderUint32List = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 96
            };
            var instance = Builder_uint32List._READER._deref(this._arena, pointer);
            this._arena._zero(pointer, 8);
            instance._isOrphan = true;
            return instance;
        };
        Structure.prototype.hasUint32List = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 96
            };
            return (!reader.isNull(pointer));
        };
        var Builder_uint64List = builder.lists.UInt64;
        Structure.prototype.initUint64List = function(n) {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 104
            };
            return Builder_uint64List._init(this._arena, pointer, n);
        };
        Structure.prototype.getUint64List = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 104
            };
            if (reader.isNull(pointer)) {
                builder.copy.pointer.setListPointer(this._defaults.uint64List._arena, this._defaults.uint64List._layout(), this._arena, pointer);
            }
            return Builder_uint64List._deref(this._arena, pointer);
        };
        Structure.prototype.setUint64List = function(value) {
            if (Builder_uint64List._TYPE !== value._TYPE) throw new TypeError();
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 104
            };
            Builder_uint64List._set(this._arena, pointer, value);
        };
        Structure.prototype.adoptUint64List = function(value) {
            if (Builder_uint64List._TYPE !== value._TYPE) throw new TypeError();
            if (!value._isOrphan) throw new ValueError('Cannot adopt non-orphans');
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 104
            };
            Builder_uint64List._adopt(this._arena, pointer, value);
        };
        Structure.prototype.disownUint64List = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 104
            };
            if (reader.isNull(pointer)) {
                return Builder_uint64List._initOrphan(this._arena);
            } else {
                var instance = Builder_uint64List._deref(this._arena, pointer);
                this._arena._zero(pointer, 8);
                instance._isOrphan = true;
                return instance;
            }
        };
        Structure.prototype.disownAsReaderUint64List = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 104
            };
            var instance = Builder_uint64List._READER._deref(this._arena, pointer);
            this._arena._zero(pointer, 8);
            instance._isOrphan = true;
            return instance;
        };
        Structure.prototype.hasUint64List = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 104
            };
            return (!reader.isNull(pointer));
        };
        var Builder_float32List = builder.lists.Float32;
        Structure.prototype.initFloat32List = function(n) {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 112
            };
            return Builder_float32List._init(this._arena, pointer, n);
        };
        Structure.prototype.getFloat32List = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 112
            };
            if (reader.isNull(pointer)) {
                builder.copy.pointer.setListPointer(this._defaults.float32List._arena, this._defaults.float32List._layout(), this._arena, pointer);
            }
            return Builder_float32List._deref(this._arena, pointer);
        };
        Structure.prototype.setFloat32List = function(value) {
            if (Builder_float32List._TYPE !== value._TYPE) throw new TypeError();
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 112
            };
            Builder_float32List._set(this._arena, pointer, value);
        };
        Structure.prototype.adoptFloat32List = function(value) {
            if (Builder_float32List._TYPE !== value._TYPE) throw new TypeError();
            if (!value._isOrphan) throw new ValueError('Cannot adopt non-orphans');
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 112
            };
            Builder_float32List._adopt(this._arena, pointer, value);
        };
        Structure.prototype.disownFloat32List = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 112
            };
            if (reader.isNull(pointer)) {
                return Builder_float32List._initOrphan(this._arena);
            } else {
                var instance = Builder_float32List._deref(this._arena, pointer);
                this._arena._zero(pointer, 8);
                instance._isOrphan = true;
                return instance;
            }
        };
        Structure.prototype.disownAsReaderFloat32List = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 112
            };
            var instance = Builder_float32List._READER._deref(this._arena, pointer);
            this._arena._zero(pointer, 8);
            instance._isOrphan = true;
            return instance;
        };
        Structure.prototype.hasFloat32List = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 112
            };
            return (!reader.isNull(pointer));
        };
        var Builder_float64List = builder.lists.Float64;
        Structure.prototype.initFloat64List = function(n) {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 120
            };
            return Builder_float64List._init(this._arena, pointer, n);
        };
        Structure.prototype.getFloat64List = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 120
            };
            if (reader.isNull(pointer)) {
                builder.copy.pointer.setListPointer(this._defaults.float64List._arena, this._defaults.float64List._layout(), this._arena, pointer);
            }
            return Builder_float64List._deref(this._arena, pointer);
        };
        Structure.prototype.setFloat64List = function(value) {
            if (Builder_float64List._TYPE !== value._TYPE) throw new TypeError();
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 120
            };
            Builder_float64List._set(this._arena, pointer, value);
        };
        Structure.prototype.adoptFloat64List = function(value) {
            if (Builder_float64List._TYPE !== value._TYPE) throw new TypeError();
            if (!value._isOrphan) throw new ValueError('Cannot adopt non-orphans');
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 120
            };
            Builder_float64List._adopt(this._arena, pointer, value);
        };
        Structure.prototype.disownFloat64List = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 120
            };
            if (reader.isNull(pointer)) {
                return Builder_float64List._initOrphan(this._arena);
            } else {
                var instance = Builder_float64List._deref(this._arena, pointer);
                this._arena._zero(pointer, 8);
                instance._isOrphan = true;
                return instance;
            }
        };
        Structure.prototype.disownAsReaderFloat64List = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 120
            };
            var instance = Builder_float64List._READER._deref(this._arena, pointer);
            this._arena._zero(pointer, 8);
            instance._isOrphan = true;
            return instance;
        };
        Structure.prototype.hasFloat64List = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 120
            };
            return (!reader.isNull(pointer));
        };
        var Builder_textList = builder.lists.Text;
        Structure.prototype.initTextList = function(n) {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 128
            };
            return Builder_textList._init(this._arena, pointer, n);
        };
        Structure.prototype.getTextList = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 128
            };
            if (reader.isNull(pointer)) {
                builder.copy.pointer.setListPointer(this._defaults.textList._arena, this._defaults.textList._layout(), this._arena, pointer);
            }
            return Builder_textList._deref(this._arena, pointer);
        };
        Structure.prototype.setTextList = function(value) {
            if (Builder_textList._TYPE !== value._TYPE) throw new TypeError();
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 128
            };
            Builder_textList._set(this._arena, pointer, value);
        };
        Structure.prototype.adoptTextList = function(value) {
            if (Builder_textList._TYPE !== value._TYPE) throw new TypeError();
            if (!value._isOrphan) throw new ValueError('Cannot adopt non-orphans');
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 128
            };
            Builder_textList._adopt(this._arena, pointer, value);
        };
        Structure.prototype.disownTextList = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 128
            };
            if (reader.isNull(pointer)) {
                return Builder_textList._initOrphan(this._arena);
            } else {
                var instance = Builder_textList._deref(this._arena, pointer);
                this._arena._zero(pointer, 8);
                instance._isOrphan = true;
                return instance;
            }
        };
        Structure.prototype.disownAsReaderTextList = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 128
            };
            var instance = Builder_textList._READER._deref(this._arena, pointer);
            this._arena._zero(pointer, 8);
            instance._isOrphan = true;
            return instance;
        };
        Structure.prototype.hasTextList = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 128
            };
            return (!reader.isNull(pointer));
        };
        var Builder_dataList = builder.lists.Data;
        Structure.prototype.initDataList = function(n) {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 136
            };
            return Builder_dataList._init(this._arena, pointer, n);
        };
        Structure.prototype.getDataList = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 136
            };
            if (reader.isNull(pointer)) {
                builder.copy.pointer.setListPointer(this._defaults.dataList._arena, this._defaults.dataList._layout(), this._arena, pointer);
            }
            return Builder_dataList._deref(this._arena, pointer);
        };
        Structure.prototype.setDataList = function(value) {
            if (Builder_dataList._TYPE !== value._TYPE) throw new TypeError();
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 136
            };
            Builder_dataList._set(this._arena, pointer, value);
        };
        Structure.prototype.adoptDataList = function(value) {
            if (Builder_dataList._TYPE !== value._TYPE) throw new TypeError();
            if (!value._isOrphan) throw new ValueError('Cannot adopt non-orphans');
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 136
            };
            Builder_dataList._adopt(this._arena, pointer, value);
        };
        Structure.prototype.disownDataList = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 136
            };
            if (reader.isNull(pointer)) {
                return Builder_dataList._initOrphan(this._arena);
            } else {
                var instance = Builder_dataList._deref(this._arena, pointer);
                this._arena._zero(pointer, 8);
                instance._isOrphan = true;
                return instance;
            }
        };
        Structure.prototype.disownAsReaderDataList = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 136
            };
            var instance = Builder_dataList._READER._deref(this._arena, pointer);
            this._arena._zero(pointer, 8);
            instance._isOrphan = true;
            return instance;
        };
        Structure.prototype.hasDataList = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 136
            };
            return (!reader.isNull(pointer));
        };
        var Builder_structList = builder.lists.structure(scope["0xd060e5f1a09c1c42"]);
        Structure.prototype.initStructList = function(n) {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 144
            };
            return Builder_structList._init(this._arena, pointer, n);
        };
        Structure.prototype.getStructList = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 144
            };
            if (reader.isNull(pointer)) {
                builder.copy.pointer.setListPointer(this._defaults.structList._arena, this._defaults.structList._layout(), this._arena, pointer);
            }
            return Builder_structList._deref(this._arena, pointer);
        };
        Structure.prototype.setStructList = function(value) {
            if (Builder_structList._TYPE !== value._TYPE) throw new TypeError();
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 144
            };
            Builder_structList._set(this._arena, pointer, value);
        };
        Structure.prototype.adoptStructList = function(value) {
            if (Builder_structList._TYPE !== value._TYPE) throw new TypeError();
            if (!value._isOrphan) throw new ValueError('Cannot adopt non-orphans');
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 144
            };
            Builder_structList._adopt(this._arena, pointer, value);
        };
        Structure.prototype.disownStructList = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 144
            };
            if (reader.isNull(pointer)) {
                return Builder_structList._initOrphan(this._arena);
            } else {
                var instance = Builder_structList._deref(this._arena, pointer);
                this._arena._zero(pointer, 8);
                instance._isOrphan = true;
                return instance;
            }
        };
        Structure.prototype.disownAsReaderStructList = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 144
            };
            var instance = Builder_structList._READER._deref(this._arena, pointer);
            this._arena._zero(pointer, 8);
            instance._isOrphan = true;
            return instance;
        };
        Structure.prototype.hasStructList = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 144
            };
            return (!reader.isNull(pointer));
        };
        var Builder_enumList = builder.lists.UInt16;
        Structure.prototype.initEnumList = function(n) {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 152
            };
            return Builder_enumList._init(this._arena, pointer, n);
        };
        Structure.prototype.getEnumList = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 152
            };
            if (reader.isNull(pointer)) {
                builder.copy.pointer.setListPointer(this._defaults.enumList._arena, this._defaults.enumList._layout(), this._arena, pointer);
            }
            return Builder_enumList._deref(this._arena, pointer);
        };
        Structure.prototype.setEnumList = function(value) {
            if (Builder_enumList._TYPE !== value._TYPE) throw new TypeError();
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 152
            };
            Builder_enumList._set(this._arena, pointer, value);
        };
        Structure.prototype.adoptEnumList = function(value) {
            if (Builder_enumList._TYPE !== value._TYPE) throw new TypeError();
            if (!value._isOrphan) throw new ValueError('Cannot adopt non-orphans');
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 152
            };
            Builder_enumList._adopt(this._arena, pointer, value);
        };
        Structure.prototype.disownEnumList = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 152
            };
            if (reader.isNull(pointer)) {
                return Builder_enumList._initOrphan(this._arena);
            } else {
                var instance = Builder_enumList._deref(this._arena, pointer);
                this._arena._zero(pointer, 8);
                instance._isOrphan = true;
                return instance;
            }
        };
        Structure.prototype.disownAsReaderEnumList = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 152
            };
            var instance = Builder_enumList._READER._deref(this._arena, pointer);
            this._arena._zero(pointer, 8);
            instance._isOrphan = true;
            return instance;
        };
        Structure.prototype.hasEnumList = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 152
            };
            return (!reader.isNull(pointer));
        };
        var Builder_anyList = builder.lists.structure(scope["0xea60082ed1eb69e6"]);
        Structure.prototype.initAnyList = function(n) {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 160
            };
            return Builder_anyList._init(this._arena, pointer, n);
        };
        Structure.prototype.getAnyList = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 160
            };
            if (reader.isNull(pointer)) {
                builder.copy.pointer.setListPointer(this._defaults.anyList._arena, this._defaults.anyList._layout(), this._arena, pointer);
            }
            return Builder_anyList._deref(this._arena, pointer);
        };
        Structure.prototype.setAnyList = function(value) {
            if (Builder_anyList._TYPE !== value._TYPE) throw new TypeError();
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 160
            };
            Builder_anyList._set(this._arena, pointer, value);
        };
        Structure.prototype.adoptAnyList = function(value) {
            if (Builder_anyList._TYPE !== value._TYPE) throw new TypeError();
            if (!value._isOrphan) throw new ValueError('Cannot adopt non-orphans');
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 160
            };
            Builder_anyList._adopt(this._arena, pointer, value);
        };
        Structure.prototype.disownAnyList = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 160
            };
            if (reader.isNull(pointer)) {
                return Builder_anyList._initOrphan(this._arena);
            } else {
                var instance = Builder_anyList._deref(this._arena, pointer);
                this._arena._zero(pointer, 8);
                instance._isOrphan = true;
                return instance;
            }
        };
        Structure.prototype.disownAsReaderAnyList = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 160
            };
            var instance = Builder_anyList._READER._deref(this._arena, pointer);
            this._arena._zero(pointer, 8);
            instance._isOrphan = true;
            return instance;
        };
        Structure.prototype.hasAnyList = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 160
            };
            return (!reader.isNull(pointer));
        };
        Structure.prototype._defaults = Structure._READER.prototype._defaults;
        return Structure;
    })();
    builders.SecondEnum = readers.SecondEnum;
    builders.SecondStruct = (function() {
        var Structure = scope["0xeab4d78288a545f6"];
        Structure.prototype.getVoidField = function() {
            return null;
        };
        Structure.prototype.setVoidField = function() {};
        Structure.prototype.getBoolField = function() {
            var position = this._dataSection + 0;
            return reader.fields.bool(0, this._segment, position, 0);
        };
        Structure.prototype.setBoolField = function(value) {
            var position = this._dataSection + 0;
            builder.fields.bool(value, 0, this._segment, position, 0);
        };
        Structure.prototype.getInt8Field = function() {
            var position = this._dataSection + 1;
            return reader.fields.int8(0, this._segment, position);
        };
        Structure.prototype.setInt8Field = function(value) {
            builder.fields.int8(value, 0, this._segment, this._dataSection + 1);
        };
        Structure.prototype.getInt16Field = function() {
            var position = this._dataSection + 2;
            return reader.fields.int16(0, this._segment, position);
        };
        Structure.prototype.setInt16Field = function(value) {
            builder.fields.int16(value, 0, this._segment, this._dataSection + 2);
        };
        Structure.prototype.getInt32Field = function() {
            var position = this._dataSection + 4;
            return reader.fields.int32(0, this._segment, position);
        };
        Structure.prototype.setInt32Field = function(value) {
            builder.fields.int32(value, 0, this._segment, this._dataSection + 4);
        };
        Structure.prototype.getInt64Field = function() {
            var position = this._dataSection + 8;
            return reader.fields.int64([0, 0], this._segment, position);
        };
        Structure.prototype.setInt64Field = function(value) {
            builder.fields.int64(value, [0, 0], this._segment, this._dataSection + 8);
        };
        Structure.prototype.getUint8Field = function() {
            var position = this._dataSection + 16;
            return reader.fields.uint8(0, this._segment, position);
        };
        Structure.prototype.setUint8Field = function(value) {
            builder.fields.uint8(value, 0, this._segment, this._dataSection + 16);
        };
        Structure.prototype.getUint16Field = function() {
            var position = this._dataSection + 18;
            return reader.fields.uint16(0, this._segment, position);
        };
        Structure.prototype.setUint16Field = function(value) {
            builder.fields.uint16(value, 0, this._segment, this._dataSection + 18);
        };
        Structure.prototype.getUint32Field = function() {
            var position = this._dataSection + 20;
            return reader.fields.uint32(0, this._segment, position);
        };
        Structure.prototype.setUint32Field = function(value) {
            builder.fields.uint32(value, 0, this._segment, this._dataSection + 20);
        };
        Structure.prototype.getUint64Field = function() {
            var position = this._dataSection + 24;
            return reader.fields.uint64([0, 0], this._segment, position);
        };
        Structure.prototype.setUint64Field = function(value) {
            builder.fields.uint64(value, [0, 0], this._segment, this._dataSection + 24);
        };
        Structure.prototype.getFloat32Field = function() {
            var position = this._dataSection + 32;
            return reader.fields.float32(this._defaults.float32Field, this._segment, position);
        };
        Structure.prototype.setFloat32Field = function(value) {
            var position = this._dataSection + 32;
            builder.fields.float32(value, this._defaults.float32Field, this._segment, position);
        };
        Structure.prototype.getFloat64Field = function() {
            var position = this._dataSection + 40;
            return reader.fields.float64(this._defaults.float64Field, this._segment, position);
        };
        Structure.prototype.setFloat64Field = function(value) {
            var position = this._dataSection + 40;
            builder.fields.float64(value, this._defaults.float64Field, this._segment, position);
        };
        Structure.prototype.getTextField = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 0
            };
            if (reader.isNull(pointer)) {
                builder.copy.pointer.setListPointer(this._defaults.textField._arena, this._defaults.textField._layout(), this._arena, pointer);
            }
            return builder.Text._deref(this._arena, pointer);
        };
        Structure.prototype.setTextField = function(value) {
            var params = builder.Text._setParams(value);
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 0
            };
            builder.Text._set(this._arena, pointer, params);
        };
        Structure.prototype.initTextField = function(n) {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 0
            };
            return builder.Text._init(this._arena, pointer, n + 1);
        };
        Structure.prototype.hasTextField = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 0
            };
            return (!reader.isNull(pointer));
        };
        Structure.prototype.adoptTextField = function(value) {
            if (builder.Text._TYPE !== value._TYPE) {
                throw new TypeError();
            }
            builder.Text._adopt(this._arena, {
                segment: this._segment,
                position: this._pointersSection + 0
            }, value);
        };
        Structure.prototype.disownTextField = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 0
            };
            if (reader.isNull(pointer)) {
                return builder.Text._initOrphan(this._arena);
            } else {
                var instance = builder.Text._deref(this._arena, pointer);
                this._arena._zero(pointer, 8);
                instance._isDisowned = true;
                return instance;
            }
        };
        Structure.prototype.getDataField = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 8
            };
            if (reader.isNull(pointer)) {
                builder.copy.pointer.setListPointer(this._defaults.dataField._arena, this._defaults.dataField._layout(), this._arena, pointer);
            }
            return builder.Data._deref(this._arena, pointer);
        };
        Structure.prototype.setDataField = function(value) {
            var params = builder.Data._setParams(value);
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 8
            };
            builder.Data._set(this._arena, pointer, params);
        };
        Structure.prototype.initDataField = function(n) {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 8
            };
            return builder.Data._init(this._arena, pointer, n);
        };
        Structure.prototype.hasDataField = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 8
            };
            return (!reader.isNull(pointer));
        };
        Structure.prototype.adoptDataField = function(value) {
            if (builder.Data._TYPE !== value._TYPE) {
                throw new TypeError();
            }
            builder.Data._adopt(this._arena, {
                segment: this._segment,
                position: this._pointersSection + 8
            }, value);
        };
        Structure.prototype.disownDataField = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 8
            };
            if (reader.isNull(pointer)) {
                return builder.Data._initOrphan(this._arena);
            } else {
                var instance = builder.Data._deref(this._arena, pointer);
                this._arena._zero(pointer, 8);
                instance._isDisowned = true;
                return instance;
            }
        };
        var Builder_structField = scope["0xeab4d78288a545f6"];
        Structure.prototype.initStructField = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 16
            };
            return Builder_structField._init(this._arena, pointer, this._depth + 1);
        };
        Structure.prototype.getStructField = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 16
            };
            if (reader.isNull(pointer)) {
                builder.copy.pointer.setStructPointer(this._defaults.structField._arena, this._defaults.structField._layout(), this._arena, pointer);
            }
            return Builder_structField._deref(this._arena, pointer);
        };
        Structure.prototype.setStructField = function(value) {
            if (Builder_structField._TYPE !== value._TYPE) throw new TypeError();
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 16
            };
            Builder_structField._set(this._arena, pointer, value);
        };
        Structure.prototype.adoptStructField = function(value) {
            if (Builder_structField._TYPE !== value._TYPE) throw new TypeError();
            if (!value._isOrphan) throw new ValueError('Cannot adopt non-orphans');
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 16
            };
            Builder_structField._adopt(this._arena, pointer, value);
        };
        Structure.prototype.disownStructField = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 16
            };
            if (reader.isNull(pointer)) {
                return Builder_structField._initOrphan(this._arena);
            } else {
                var instance = Builder_structField._deref(this._arena, pointer);
                this._arena._zero(pointer, 8);
                instance._isOrphan = true;
                return instance;
            }
        };
        Structure.prototype.disownAsReaderStructField = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 16
            };
            var instance = Builder_structField._READER._deref(this._arena, pointer);
            this._arena._zero(pointer, 8);
            instance._isOrphan = true;
            return instance;
        };
        Structure.prototype.hasStructField = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 16
            };
            return (!reader.isNull(pointer));
        };
        Structure.prototype.getEnumField = function() {
            var position = this._dataSection + 36;
            return reader.fields.uint16(0, this._segment, position);
        };
        Structure.prototype.setEnumField = function(value) {
            builder.fields.uint16(value, 0, this._segment, this._dataSection + 36);
        };
        Structure.prototype.getAnyField = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 24
            };
            return builder.AnyPointer._deref(this._arena, pointer);
        };
        Structure.prototype.setAnyField = function(value) {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 24
            };
            builder.AnyPointer._set(this._arena, pointer, value);
        };
        Structure.prototype.adoptAnyField = function(value) {
            if (builder.AnyPointerBlob._TYPE !== value._TYPE) {
                throw new TypeError();
            }
            if (!value._isDisowned) {
                throw new ValueError('Attempted to adopt an AnyPointerBlob a second time');
            }
            builder.AnyPointerBlob._adopt(this._arena, {
                segment: this._segment,
                position: this._pointersSection + 24
            }, value);
        };
        Structure.prototype.disownAnyField = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 24
            };
            var instance = new builder.AnyPointerBlob(this._arena, pointer);
            this._arena._zero(pointer, 8);
            return instance;
        };
        var Builder_voidList = builder.lists.Void;
        Structure.prototype.initVoidList = function(n) {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 32
            };
            return Builder_voidList._init(this._arena, pointer, n);
        };
        Structure.prototype.getVoidList = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 32
            };
            if (reader.isNull(pointer)) {
                builder.copy.pointer.setListPointer(this._defaults.voidList._arena, this._defaults.voidList._layout(), this._arena, pointer);
            }
            return Builder_voidList._deref(this._arena, pointer);
        };
        Structure.prototype.setVoidList = function(value) {
            if (Builder_voidList._TYPE !== value._TYPE) throw new TypeError();
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 32
            };
            Builder_voidList._set(this._arena, pointer, value);
        };
        Structure.prototype.adoptVoidList = function(value) {
            if (Builder_voidList._TYPE !== value._TYPE) throw new TypeError();
            if (!value._isOrphan) throw new ValueError('Cannot adopt non-orphans');
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 32
            };
            Builder_voidList._adopt(this._arena, pointer, value);
        };
        Structure.prototype.disownVoidList = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 32
            };
            if (reader.isNull(pointer)) {
                return Builder_voidList._initOrphan(this._arena);
            } else {
                var instance = Builder_voidList._deref(this._arena, pointer);
                this._arena._zero(pointer, 8);
                instance._isOrphan = true;
                return instance;
            }
        };
        Structure.prototype.disownAsReaderVoidList = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 32
            };
            var instance = Builder_voidList._READER._deref(this._arena, pointer);
            this._arena._zero(pointer, 8);
            instance._isOrphan = true;
            return instance;
        };
        Structure.prototype.hasVoidList = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 32
            };
            return (!reader.isNull(pointer));
        };
        var Builder_boolList = builder.lists.Bool;
        Structure.prototype.initBoolList = function(n) {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 40
            };
            return Builder_boolList._init(this._arena, pointer, n);
        };
        Structure.prototype.getBoolList = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 40
            };
            if (reader.isNull(pointer)) {
                builder.copy.pointer.setListPointer(this._defaults.boolList._arena, this._defaults.boolList._layout(), this._arena, pointer);
            }
            return Builder_boolList._deref(this._arena, pointer);
        };
        Structure.prototype.setBoolList = function(value) {
            if (Builder_boolList._TYPE !== value._TYPE) throw new TypeError();
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 40
            };
            Builder_boolList._set(this._arena, pointer, value);
        };
        Structure.prototype.adoptBoolList = function(value) {
            if (Builder_boolList._TYPE !== value._TYPE) throw new TypeError();
            if (!value._isOrphan) throw new ValueError('Cannot adopt non-orphans');
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 40
            };
            Builder_boolList._adopt(this._arena, pointer, value);
        };
        Structure.prototype.disownBoolList = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 40
            };
            if (reader.isNull(pointer)) {
                return Builder_boolList._initOrphan(this._arena);
            } else {
                var instance = Builder_boolList._deref(this._arena, pointer);
                this._arena._zero(pointer, 8);
                instance._isOrphan = true;
                return instance;
            }
        };
        Structure.prototype.disownAsReaderBoolList = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 40
            };
            var instance = Builder_boolList._READER._deref(this._arena, pointer);
            this._arena._zero(pointer, 8);
            instance._isOrphan = true;
            return instance;
        };
        Structure.prototype.hasBoolList = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 40
            };
            return (!reader.isNull(pointer));
        };
        var Builder_int8List = builder.lists.Int8;
        Structure.prototype.initInt8List = function(n) {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 48
            };
            return Builder_int8List._init(this._arena, pointer, n);
        };
        Structure.prototype.getInt8List = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 48
            };
            if (reader.isNull(pointer)) {
                builder.copy.pointer.setListPointer(this._defaults.int8List._arena, this._defaults.int8List._layout(), this._arena, pointer);
            }
            return Builder_int8List._deref(this._arena, pointer);
        };
        Structure.prototype.setInt8List = function(value) {
            if (Builder_int8List._TYPE !== value._TYPE) throw new TypeError();
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 48
            };
            Builder_int8List._set(this._arena, pointer, value);
        };
        Structure.prototype.adoptInt8List = function(value) {
            if (Builder_int8List._TYPE !== value._TYPE) throw new TypeError();
            if (!value._isOrphan) throw new ValueError('Cannot adopt non-orphans');
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 48
            };
            Builder_int8List._adopt(this._arena, pointer, value);
        };
        Structure.prototype.disownInt8List = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 48
            };
            if (reader.isNull(pointer)) {
                return Builder_int8List._initOrphan(this._arena);
            } else {
                var instance = Builder_int8List._deref(this._arena, pointer);
                this._arena._zero(pointer, 8);
                instance._isOrphan = true;
                return instance;
            }
        };
        Structure.prototype.disownAsReaderInt8List = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 48
            };
            var instance = Builder_int8List._READER._deref(this._arena, pointer);
            this._arena._zero(pointer, 8);
            instance._isOrphan = true;
            return instance;
        };
        Structure.prototype.hasInt8List = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 48
            };
            return (!reader.isNull(pointer));
        };
        var Builder_int16List = builder.lists.Int16;
        Structure.prototype.initInt16List = function(n) {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 56
            };
            return Builder_int16List._init(this._arena, pointer, n);
        };
        Structure.prototype.getInt16List = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 56
            };
            if (reader.isNull(pointer)) {
                builder.copy.pointer.setListPointer(this._defaults.int16List._arena, this._defaults.int16List._layout(), this._arena, pointer);
            }
            return Builder_int16List._deref(this._arena, pointer);
        };
        Structure.prototype.setInt16List = function(value) {
            if (Builder_int16List._TYPE !== value._TYPE) throw new TypeError();
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 56
            };
            Builder_int16List._set(this._arena, pointer, value);
        };
        Structure.prototype.adoptInt16List = function(value) {
            if (Builder_int16List._TYPE !== value._TYPE) throw new TypeError();
            if (!value._isOrphan) throw new ValueError('Cannot adopt non-orphans');
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 56
            };
            Builder_int16List._adopt(this._arena, pointer, value);
        };
        Structure.prototype.disownInt16List = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 56
            };
            if (reader.isNull(pointer)) {
                return Builder_int16List._initOrphan(this._arena);
            } else {
                var instance = Builder_int16List._deref(this._arena, pointer);
                this._arena._zero(pointer, 8);
                instance._isOrphan = true;
                return instance;
            }
        };
        Structure.prototype.disownAsReaderInt16List = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 56
            };
            var instance = Builder_int16List._READER._deref(this._arena, pointer);
            this._arena._zero(pointer, 8);
            instance._isOrphan = true;
            return instance;
        };
        Structure.prototype.hasInt16List = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 56
            };
            return (!reader.isNull(pointer));
        };
        var Builder_int32List = builder.lists.Int32;
        Structure.prototype.initInt32List = function(n) {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 64
            };
            return Builder_int32List._init(this._arena, pointer, n);
        };
        Structure.prototype.getInt32List = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 64
            };
            if (reader.isNull(pointer)) {
                builder.copy.pointer.setListPointer(this._defaults.int32List._arena, this._defaults.int32List._layout(), this._arena, pointer);
            }
            return Builder_int32List._deref(this._arena, pointer);
        };
        Structure.prototype.setInt32List = function(value) {
            if (Builder_int32List._TYPE !== value._TYPE) throw new TypeError();
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 64
            };
            Builder_int32List._set(this._arena, pointer, value);
        };
        Structure.prototype.adoptInt32List = function(value) {
            if (Builder_int32List._TYPE !== value._TYPE) throw new TypeError();
            if (!value._isOrphan) throw new ValueError('Cannot adopt non-orphans');
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 64
            };
            Builder_int32List._adopt(this._arena, pointer, value);
        };
        Structure.prototype.disownInt32List = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 64
            };
            if (reader.isNull(pointer)) {
                return Builder_int32List._initOrphan(this._arena);
            } else {
                var instance = Builder_int32List._deref(this._arena, pointer);
                this._arena._zero(pointer, 8);
                instance._isOrphan = true;
                return instance;
            }
        };
        Structure.prototype.disownAsReaderInt32List = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 64
            };
            var instance = Builder_int32List._READER._deref(this._arena, pointer);
            this._arena._zero(pointer, 8);
            instance._isOrphan = true;
            return instance;
        };
        Structure.prototype.hasInt32List = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 64
            };
            return (!reader.isNull(pointer));
        };
        var Builder_int64List = builder.lists.Int64;
        Structure.prototype.initInt64List = function(n) {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 72
            };
            return Builder_int64List._init(this._arena, pointer, n);
        };
        Structure.prototype.getInt64List = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 72
            };
            if (reader.isNull(pointer)) {
                builder.copy.pointer.setListPointer(this._defaults.int64List._arena, this._defaults.int64List._layout(), this._arena, pointer);
            }
            return Builder_int64List._deref(this._arena, pointer);
        };
        Structure.prototype.setInt64List = function(value) {
            if (Builder_int64List._TYPE !== value._TYPE) throw new TypeError();
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 72
            };
            Builder_int64List._set(this._arena, pointer, value);
        };
        Structure.prototype.adoptInt64List = function(value) {
            if (Builder_int64List._TYPE !== value._TYPE) throw new TypeError();
            if (!value._isOrphan) throw new ValueError('Cannot adopt non-orphans');
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 72
            };
            Builder_int64List._adopt(this._arena, pointer, value);
        };
        Structure.prototype.disownInt64List = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 72
            };
            if (reader.isNull(pointer)) {
                return Builder_int64List._initOrphan(this._arena);
            } else {
                var instance = Builder_int64List._deref(this._arena, pointer);
                this._arena._zero(pointer, 8);
                instance._isOrphan = true;
                return instance;
            }
        };
        Structure.prototype.disownAsReaderInt64List = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 72
            };
            var instance = Builder_int64List._READER._deref(this._arena, pointer);
            this._arena._zero(pointer, 8);
            instance._isOrphan = true;
            return instance;
        };
        Structure.prototype.hasInt64List = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 72
            };
            return (!reader.isNull(pointer));
        };
        var Builder_uint8List = builder.lists.UInt8;
        Structure.prototype.initUint8List = function(n) {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 80
            };
            return Builder_uint8List._init(this._arena, pointer, n);
        };
        Structure.prototype.getUint8List = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 80
            };
            if (reader.isNull(pointer)) {
                builder.copy.pointer.setListPointer(this._defaults.uint8List._arena, this._defaults.uint8List._layout(), this._arena, pointer);
            }
            return Builder_uint8List._deref(this._arena, pointer);
        };
        Structure.prototype.setUint8List = function(value) {
            if (Builder_uint8List._TYPE !== value._TYPE) throw new TypeError();
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 80
            };
            Builder_uint8List._set(this._arena, pointer, value);
        };
        Structure.prototype.adoptUint8List = function(value) {
            if (Builder_uint8List._TYPE !== value._TYPE) throw new TypeError();
            if (!value._isOrphan) throw new ValueError('Cannot adopt non-orphans');
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 80
            };
            Builder_uint8List._adopt(this._arena, pointer, value);
        };
        Structure.prototype.disownUint8List = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 80
            };
            if (reader.isNull(pointer)) {
                return Builder_uint8List._initOrphan(this._arena);
            } else {
                var instance = Builder_uint8List._deref(this._arena, pointer);
                this._arena._zero(pointer, 8);
                instance._isOrphan = true;
                return instance;
            }
        };
        Structure.prototype.disownAsReaderUint8List = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 80
            };
            var instance = Builder_uint8List._READER._deref(this._arena, pointer);
            this._arena._zero(pointer, 8);
            instance._isOrphan = true;
            return instance;
        };
        Structure.prototype.hasUint8List = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 80
            };
            return (!reader.isNull(pointer));
        };
        var Builder_uint16List = builder.lists.UInt16;
        Structure.prototype.initUint16List = function(n) {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 88
            };
            return Builder_uint16List._init(this._arena, pointer, n);
        };
        Structure.prototype.getUint16List = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 88
            };
            if (reader.isNull(pointer)) {
                builder.copy.pointer.setListPointer(this._defaults.uint16List._arena, this._defaults.uint16List._layout(), this._arena, pointer);
            }
            return Builder_uint16List._deref(this._arena, pointer);
        };
        Structure.prototype.setUint16List = function(value) {
            if (Builder_uint16List._TYPE !== value._TYPE) throw new TypeError();
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 88
            };
            Builder_uint16List._set(this._arena, pointer, value);
        };
        Structure.prototype.adoptUint16List = function(value) {
            if (Builder_uint16List._TYPE !== value._TYPE) throw new TypeError();
            if (!value._isOrphan) throw new ValueError('Cannot adopt non-orphans');
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 88
            };
            Builder_uint16List._adopt(this._arena, pointer, value);
        };
        Structure.prototype.disownUint16List = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 88
            };
            if (reader.isNull(pointer)) {
                return Builder_uint16List._initOrphan(this._arena);
            } else {
                var instance = Builder_uint16List._deref(this._arena, pointer);
                this._arena._zero(pointer, 8);
                instance._isOrphan = true;
                return instance;
            }
        };
        Structure.prototype.disownAsReaderUint16List = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 88
            };
            var instance = Builder_uint16List._READER._deref(this._arena, pointer);
            this._arena._zero(pointer, 8);
            instance._isOrphan = true;
            return instance;
        };
        Structure.prototype.hasUint16List = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 88
            };
            return (!reader.isNull(pointer));
        };
        var Builder_uint32List = builder.lists.UInt32;
        Structure.prototype.initUint32List = function(n) {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 96
            };
            return Builder_uint32List._init(this._arena, pointer, n);
        };
        Structure.prototype.getUint32List = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 96
            };
            if (reader.isNull(pointer)) {
                builder.copy.pointer.setListPointer(this._defaults.uint32List._arena, this._defaults.uint32List._layout(), this._arena, pointer);
            }
            return Builder_uint32List._deref(this._arena, pointer);
        };
        Structure.prototype.setUint32List = function(value) {
            if (Builder_uint32List._TYPE !== value._TYPE) throw new TypeError();
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 96
            };
            Builder_uint32List._set(this._arena, pointer, value);
        };
        Structure.prototype.adoptUint32List = function(value) {
            if (Builder_uint32List._TYPE !== value._TYPE) throw new TypeError();
            if (!value._isOrphan) throw new ValueError('Cannot adopt non-orphans');
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 96
            };
            Builder_uint32List._adopt(this._arena, pointer, value);
        };
        Structure.prototype.disownUint32List = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 96
            };
            if (reader.isNull(pointer)) {
                return Builder_uint32List._initOrphan(this._arena);
            } else {
                var instance = Builder_uint32List._deref(this._arena, pointer);
                this._arena._zero(pointer, 8);
                instance._isOrphan = true;
                return instance;
            }
        };
        Structure.prototype.disownAsReaderUint32List = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 96
            };
            var instance = Builder_uint32List._READER._deref(this._arena, pointer);
            this._arena._zero(pointer, 8);
            instance._isOrphan = true;
            return instance;
        };
        Structure.prototype.hasUint32List = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 96
            };
            return (!reader.isNull(pointer));
        };
        var Builder_uint64List = builder.lists.UInt64;
        Structure.prototype.initUint64List = function(n) {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 104
            };
            return Builder_uint64List._init(this._arena, pointer, n);
        };
        Structure.prototype.getUint64List = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 104
            };
            if (reader.isNull(pointer)) {
                builder.copy.pointer.setListPointer(this._defaults.uint64List._arena, this._defaults.uint64List._layout(), this._arena, pointer);
            }
            return Builder_uint64List._deref(this._arena, pointer);
        };
        Structure.prototype.setUint64List = function(value) {
            if (Builder_uint64List._TYPE !== value._TYPE) throw new TypeError();
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 104
            };
            Builder_uint64List._set(this._arena, pointer, value);
        };
        Structure.prototype.adoptUint64List = function(value) {
            if (Builder_uint64List._TYPE !== value._TYPE) throw new TypeError();
            if (!value._isOrphan) throw new ValueError('Cannot adopt non-orphans');
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 104
            };
            Builder_uint64List._adopt(this._arena, pointer, value);
        };
        Structure.prototype.disownUint64List = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 104
            };
            if (reader.isNull(pointer)) {
                return Builder_uint64List._initOrphan(this._arena);
            } else {
                var instance = Builder_uint64List._deref(this._arena, pointer);
                this._arena._zero(pointer, 8);
                instance._isOrphan = true;
                return instance;
            }
        };
        Structure.prototype.disownAsReaderUint64List = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 104
            };
            var instance = Builder_uint64List._READER._deref(this._arena, pointer);
            this._arena._zero(pointer, 8);
            instance._isOrphan = true;
            return instance;
        };
        Structure.prototype.hasUint64List = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 104
            };
            return (!reader.isNull(pointer));
        };
        var Builder_float32List = builder.lists.Float32;
        Structure.prototype.initFloat32List = function(n) {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 112
            };
            return Builder_float32List._init(this._arena, pointer, n);
        };
        Structure.prototype.getFloat32List = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 112
            };
            if (reader.isNull(pointer)) {
                builder.copy.pointer.setListPointer(this._defaults.float32List._arena, this._defaults.float32List._layout(), this._arena, pointer);
            }
            return Builder_float32List._deref(this._arena, pointer);
        };
        Structure.prototype.setFloat32List = function(value) {
            if (Builder_float32List._TYPE !== value._TYPE) throw new TypeError();
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 112
            };
            Builder_float32List._set(this._arena, pointer, value);
        };
        Structure.prototype.adoptFloat32List = function(value) {
            if (Builder_float32List._TYPE !== value._TYPE) throw new TypeError();
            if (!value._isOrphan) throw new ValueError('Cannot adopt non-orphans');
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 112
            };
            Builder_float32List._adopt(this._arena, pointer, value);
        };
        Structure.prototype.disownFloat32List = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 112
            };
            if (reader.isNull(pointer)) {
                return Builder_float32List._initOrphan(this._arena);
            } else {
                var instance = Builder_float32List._deref(this._arena, pointer);
                this._arena._zero(pointer, 8);
                instance._isOrphan = true;
                return instance;
            }
        };
        Structure.prototype.disownAsReaderFloat32List = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 112
            };
            var instance = Builder_float32List._READER._deref(this._arena, pointer);
            this._arena._zero(pointer, 8);
            instance._isOrphan = true;
            return instance;
        };
        Structure.prototype.hasFloat32List = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 112
            };
            return (!reader.isNull(pointer));
        };
        var Builder_float64List = builder.lists.Float64;
        Structure.prototype.initFloat64List = function(n) {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 120
            };
            return Builder_float64List._init(this._arena, pointer, n);
        };
        Structure.prototype.getFloat64List = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 120
            };
            if (reader.isNull(pointer)) {
                builder.copy.pointer.setListPointer(this._defaults.float64List._arena, this._defaults.float64List._layout(), this._arena, pointer);
            }
            return Builder_float64List._deref(this._arena, pointer);
        };
        Structure.prototype.setFloat64List = function(value) {
            if (Builder_float64List._TYPE !== value._TYPE) throw new TypeError();
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 120
            };
            Builder_float64List._set(this._arena, pointer, value);
        };
        Structure.prototype.adoptFloat64List = function(value) {
            if (Builder_float64List._TYPE !== value._TYPE) throw new TypeError();
            if (!value._isOrphan) throw new ValueError('Cannot adopt non-orphans');
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 120
            };
            Builder_float64List._adopt(this._arena, pointer, value);
        };
        Structure.prototype.disownFloat64List = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 120
            };
            if (reader.isNull(pointer)) {
                return Builder_float64List._initOrphan(this._arena);
            } else {
                var instance = Builder_float64List._deref(this._arena, pointer);
                this._arena._zero(pointer, 8);
                instance._isOrphan = true;
                return instance;
            }
        };
        Structure.prototype.disownAsReaderFloat64List = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 120
            };
            var instance = Builder_float64List._READER._deref(this._arena, pointer);
            this._arena._zero(pointer, 8);
            instance._isOrphan = true;
            return instance;
        };
        Structure.prototype.hasFloat64List = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 120
            };
            return (!reader.isNull(pointer));
        };
        var Builder_textList = builder.lists.Text;
        Structure.prototype.initTextList = function(n) {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 128
            };
            return Builder_textList._init(this._arena, pointer, n);
        };
        Structure.prototype.getTextList = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 128
            };
            if (reader.isNull(pointer)) {
                builder.copy.pointer.setListPointer(this._defaults.textList._arena, this._defaults.textList._layout(), this._arena, pointer);
            }
            return Builder_textList._deref(this._arena, pointer);
        };
        Structure.prototype.setTextList = function(value) {
            if (Builder_textList._TYPE !== value._TYPE) throw new TypeError();
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 128
            };
            Builder_textList._set(this._arena, pointer, value);
        };
        Structure.prototype.adoptTextList = function(value) {
            if (Builder_textList._TYPE !== value._TYPE) throw new TypeError();
            if (!value._isOrphan) throw new ValueError('Cannot adopt non-orphans');
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 128
            };
            Builder_textList._adopt(this._arena, pointer, value);
        };
        Structure.prototype.disownTextList = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 128
            };
            if (reader.isNull(pointer)) {
                return Builder_textList._initOrphan(this._arena);
            } else {
                var instance = Builder_textList._deref(this._arena, pointer);
                this._arena._zero(pointer, 8);
                instance._isOrphan = true;
                return instance;
            }
        };
        Structure.prototype.disownAsReaderTextList = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 128
            };
            var instance = Builder_textList._READER._deref(this._arena, pointer);
            this._arena._zero(pointer, 8);
            instance._isOrphan = true;
            return instance;
        };
        Structure.prototype.hasTextList = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 128
            };
            return (!reader.isNull(pointer));
        };
        var Builder_dataList = builder.lists.Data;
        Structure.prototype.initDataList = function(n) {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 136
            };
            return Builder_dataList._init(this._arena, pointer, n);
        };
        Structure.prototype.getDataList = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 136
            };
            if (reader.isNull(pointer)) {
                builder.copy.pointer.setListPointer(this._defaults.dataList._arena, this._defaults.dataList._layout(), this._arena, pointer);
            }
            return Builder_dataList._deref(this._arena, pointer);
        };
        Structure.prototype.setDataList = function(value) {
            if (Builder_dataList._TYPE !== value._TYPE) throw new TypeError();
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 136
            };
            Builder_dataList._set(this._arena, pointer, value);
        };
        Structure.prototype.adoptDataList = function(value) {
            if (Builder_dataList._TYPE !== value._TYPE) throw new TypeError();
            if (!value._isOrphan) throw new ValueError('Cannot adopt non-orphans');
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 136
            };
            Builder_dataList._adopt(this._arena, pointer, value);
        };
        Structure.prototype.disownDataList = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 136
            };
            if (reader.isNull(pointer)) {
                return Builder_dataList._initOrphan(this._arena);
            } else {
                var instance = Builder_dataList._deref(this._arena, pointer);
                this._arena._zero(pointer, 8);
                instance._isOrphan = true;
                return instance;
            }
        };
        Structure.prototype.disownAsReaderDataList = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 136
            };
            var instance = Builder_dataList._READER._deref(this._arena, pointer);
            this._arena._zero(pointer, 8);
            instance._isOrphan = true;
            return instance;
        };
        Structure.prototype.hasDataList = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 136
            };
            return (!reader.isNull(pointer));
        };
        var Builder_structList = builder.lists.structure(scope["0xeab4d78288a545f6"]);
        Structure.prototype.initStructList = function(n) {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 144
            };
            return Builder_structList._init(this._arena, pointer, n);
        };
        Structure.prototype.getStructList = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 144
            };
            if (reader.isNull(pointer)) {
                builder.copy.pointer.setListPointer(this._defaults.structList._arena, this._defaults.structList._layout(), this._arena, pointer);
            }
            return Builder_structList._deref(this._arena, pointer);
        };
        Structure.prototype.setStructList = function(value) {
            if (Builder_structList._TYPE !== value._TYPE) throw new TypeError();
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 144
            };
            Builder_structList._set(this._arena, pointer, value);
        };
        Structure.prototype.adoptStructList = function(value) {
            if (Builder_structList._TYPE !== value._TYPE) throw new TypeError();
            if (!value._isOrphan) throw new ValueError('Cannot adopt non-orphans');
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 144
            };
            Builder_structList._adopt(this._arena, pointer, value);
        };
        Structure.prototype.disownStructList = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 144
            };
            if (reader.isNull(pointer)) {
                return Builder_structList._initOrphan(this._arena);
            } else {
                var instance = Builder_structList._deref(this._arena, pointer);
                this._arena._zero(pointer, 8);
                instance._isOrphan = true;
                return instance;
            }
        };
        Structure.prototype.disownAsReaderStructList = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 144
            };
            var instance = Builder_structList._READER._deref(this._arena, pointer);
            this._arena._zero(pointer, 8);
            instance._isOrphan = true;
            return instance;
        };
        Structure.prototype.hasStructList = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 144
            };
            return (!reader.isNull(pointer));
        };
        var Builder_enumList = builder.lists.UInt16;
        Structure.prototype.initEnumList = function(n) {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 152
            };
            return Builder_enumList._init(this._arena, pointer, n);
        };
        Structure.prototype.getEnumList = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 152
            };
            if (reader.isNull(pointer)) {
                builder.copy.pointer.setListPointer(this._defaults.enumList._arena, this._defaults.enumList._layout(), this._arena, pointer);
            }
            return Builder_enumList._deref(this._arena, pointer);
        };
        Structure.prototype.setEnumList = function(value) {
            if (Builder_enumList._TYPE !== value._TYPE) throw new TypeError();
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 152
            };
            Builder_enumList._set(this._arena, pointer, value);
        };
        Structure.prototype.adoptEnumList = function(value) {
            if (Builder_enumList._TYPE !== value._TYPE) throw new TypeError();
            if (!value._isOrphan) throw new ValueError('Cannot adopt non-orphans');
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 152
            };
            Builder_enumList._adopt(this._arena, pointer, value);
        };
        Structure.prototype.disownEnumList = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 152
            };
            if (reader.isNull(pointer)) {
                return Builder_enumList._initOrphan(this._arena);
            } else {
                var instance = Builder_enumList._deref(this._arena, pointer);
                this._arena._zero(pointer, 8);
                instance._isOrphan = true;
                return instance;
            }
        };
        Structure.prototype.disownAsReaderEnumList = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 152
            };
            var instance = Builder_enumList._READER._deref(this._arena, pointer);
            this._arena._zero(pointer, 8);
            instance._isOrphan = true;
            return instance;
        };
        Structure.prototype.hasEnumList = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 152
            };
            return (!reader.isNull(pointer));
        };
        var Builder_anyList = builder.lists.structure(scope["0xea60082ed1eb69e6"]);
        Structure.prototype.initAnyList = function(n) {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 160
            };
            return Builder_anyList._init(this._arena, pointer, n);
        };
        Structure.prototype.getAnyList = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 160
            };
            if (reader.isNull(pointer)) {
                builder.copy.pointer.setListPointer(this._defaults.anyList._arena, this._defaults.anyList._layout(), this._arena, pointer);
            }
            return Builder_anyList._deref(this._arena, pointer);
        };
        Structure.prototype.setAnyList = function(value) {
            if (Builder_anyList._TYPE !== value._TYPE) throw new TypeError();
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 160
            };
            Builder_anyList._set(this._arena, pointer, value);
        };
        Structure.prototype.adoptAnyList = function(value) {
            if (Builder_anyList._TYPE !== value._TYPE) throw new TypeError();
            if (!value._isOrphan) throw new ValueError('Cannot adopt non-orphans');
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 160
            };
            Builder_anyList._adopt(this._arena, pointer, value);
        };
        Structure.prototype.disownAnyList = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 160
            };
            if (reader.isNull(pointer)) {
                return Builder_anyList._initOrphan(this._arena);
            } else {
                var instance = Builder_anyList._deref(this._arena, pointer);
                this._arena._zero(pointer, 8);
                instance._isOrphan = true;
                return instance;
            }
        };
        Structure.prototype.disownAsReaderAnyList = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 160
            };
            var instance = Builder_anyList._READER._deref(this._arena, pointer);
            this._arena._zero(pointer, 8);
            instance._isOrphan = true;
            return instance;
        };
        Structure.prototype.hasAnyList = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 160
            };
            return (!reader.isNull(pointer));
        };
        Structure.prototype.getAddedInt16Field = function() {
            var position = this._dataSection + 38;
            return reader.fields.int16(-32015, this._segment, position);
        };
        Structure.prototype.setAddedInt16Field = function(value) {
            builder.fields.int16(value, -32015, this._segment, this._dataSection + 38);
        };
        Structure.prototype.getAddedEnumField = function() {
            var position = this._dataSection + 48;
            return reader.fields.uint16(3, this._segment, position);
        };
        Structure.prototype.setAddedEnumField = function(value) {
            builder.fields.uint16(value, 3, this._segment, this._dataSection + 48);
        };
        var Builder_addedStructList = builder.lists.structure(scope["0xeab4d78288a545f6"]);
        Structure.prototype.initAddedStructList = function(n) {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 168
            };
            return Builder_addedStructList._init(this._arena, pointer, n);
        };
        Structure.prototype.getAddedStructList = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 168
            };
            if (reader.isNull(pointer)) {
                builder.copy.pointer.setListPointer(this._defaults.addedStructList._arena, this._defaults.addedStructList._layout(), this._arena, pointer);
            }
            return Builder_addedStructList._deref(this._arena, pointer);
        };
        Structure.prototype.setAddedStructList = function(value) {
            if (Builder_addedStructList._TYPE !== value._TYPE) throw new TypeError();
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 168
            };
            Builder_addedStructList._set(this._arena, pointer, value);
        };
        Structure.prototype.adoptAddedStructList = function(value) {
            if (Builder_addedStructList._TYPE !== value._TYPE) throw new TypeError();
            if (!value._isOrphan) throw new ValueError('Cannot adopt non-orphans');
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 168
            };
            Builder_addedStructList._adopt(this._arena, pointer, value);
        };
        Structure.prototype.disownAddedStructList = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 168
            };
            if (reader.isNull(pointer)) {
                return Builder_addedStructList._initOrphan(this._arena);
            } else {
                var instance = Builder_addedStructList._deref(this._arena, pointer);
                this._arena._zero(pointer, 8);
                instance._isOrphan = true;
                return instance;
            }
        };
        Structure.prototype.disownAsReaderAddedStructList = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 168
            };
            var instance = Builder_addedStructList._READER._deref(this._arena, pointer);
            this._arena._zero(pointer, 8);
            instance._isOrphan = true;
            return instance;
        };
        Structure.prototype.hasAddedStructList = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 168
            };
            return (!reader.isNull(pointer));
        };
        var Builder_addedEnumList = builder.lists.UInt16;
        Structure.prototype.initAddedEnumList = function(n) {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 176
            };
            return Builder_addedEnumList._init(this._arena, pointer, n);
        };
        Structure.prototype.getAddedEnumList = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 176
            };
            if (reader.isNull(pointer)) {
                builder.copy.pointer.setListPointer(this._defaults.addedEnumList._arena, this._defaults.addedEnumList._layout(), this._arena, pointer);
            }
            return Builder_addedEnumList._deref(this._arena, pointer);
        };
        Structure.prototype.setAddedEnumList = function(value) {
            if (Builder_addedEnumList._TYPE !== value._TYPE) throw new TypeError();
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 176
            };
            Builder_addedEnumList._set(this._arena, pointer, value);
        };
        Structure.prototype.adoptAddedEnumList = function(value) {
            if (Builder_addedEnumList._TYPE !== value._TYPE) throw new TypeError();
            if (!value._isOrphan) throw new ValueError('Cannot adopt non-orphans');
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 176
            };
            Builder_addedEnumList._adopt(this._arena, pointer, value);
        };
        Structure.prototype.disownAddedEnumList = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 176
            };
            if (reader.isNull(pointer)) {
                return Builder_addedEnumList._initOrphan(this._arena);
            } else {
                var instance = Builder_addedEnumList._deref(this._arena, pointer);
                this._arena._zero(pointer, 8);
                instance._isOrphan = true;
                return instance;
            }
        };
        Structure.prototype.disownAsReaderAddedEnumList = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 176
            };
            var instance = Builder_addedEnumList._READER._deref(this._arena, pointer);
            this._arena._zero(pointer, 8);
            instance._isOrphan = true;
            return instance;
        };
        Structure.prototype.hasAddedEnumList = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 176
            };
            return (!reader.isNull(pointer));
        };
        var Builder_addedTextList = builder.lists.Text;
        Structure.prototype.initAddedTextList = function(n) {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 184
            };
            return Builder_addedTextList._init(this._arena, pointer, n);
        };
        Structure.prototype.getAddedTextList = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 184
            };
            if (reader.isNull(pointer)) {
                builder.copy.pointer.setListPointer(this._defaults.addedTextList._arena, this._defaults.addedTextList._layout(), this._arena, pointer);
            }
            return Builder_addedTextList._deref(this._arena, pointer);
        };
        Structure.prototype.setAddedTextList = function(value) {
            if (Builder_addedTextList._TYPE !== value._TYPE) throw new TypeError();
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 184
            };
            Builder_addedTextList._set(this._arena, pointer, value);
        };
        Structure.prototype.adoptAddedTextList = function(value) {
            if (Builder_addedTextList._TYPE !== value._TYPE) throw new TypeError();
            if (!value._isOrphan) throw new ValueError('Cannot adopt non-orphans');
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 184
            };
            Builder_addedTextList._adopt(this._arena, pointer, value);
        };
        Structure.prototype.disownAddedTextList = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 184
            };
            if (reader.isNull(pointer)) {
                return Builder_addedTextList._initOrphan(this._arena);
            } else {
                var instance = Builder_addedTextList._deref(this._arena, pointer);
                this._arena._zero(pointer, 8);
                instance._isOrphan = true;
                return instance;
            }
        };
        Structure.prototype.disownAsReaderAddedTextList = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 184
            };
            var instance = Builder_addedTextList._READER._deref(this._arena, pointer);
            this._arena._zero(pointer, 8);
            instance._isOrphan = true;
            return instance;
        };
        Structure.prototype.hasAddedTextList = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 184
            };
            return (!reader.isNull(pointer));
        };
        var Builder_addedInt8List = builder.lists.Int8;
        Structure.prototype.initAddedInt8List = function(n) {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 192
            };
            return Builder_addedInt8List._init(this._arena, pointer, n);
        };
        Structure.prototype.getAddedInt8List = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 192
            };
            if (reader.isNull(pointer)) {
                builder.copy.pointer.setListPointer(this._defaults.addedInt8List._arena, this._defaults.addedInt8List._layout(), this._arena, pointer);
            }
            return Builder_addedInt8List._deref(this._arena, pointer);
        };
        Structure.prototype.setAddedInt8List = function(value) {
            if (Builder_addedInt8List._TYPE !== value._TYPE) throw new TypeError();
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 192
            };
            Builder_addedInt8List._set(this._arena, pointer, value);
        };
        Structure.prototype.adoptAddedInt8List = function(value) {
            if (Builder_addedInt8List._TYPE !== value._TYPE) throw new TypeError();
            if (!value._isOrphan) throw new ValueError('Cannot adopt non-orphans');
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 192
            };
            Builder_addedInt8List._adopt(this._arena, pointer, value);
        };
        Structure.prototype.disownAddedInt8List = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 192
            };
            if (reader.isNull(pointer)) {
                return Builder_addedInt8List._initOrphan(this._arena);
            } else {
                var instance = Builder_addedInt8List._deref(this._arena, pointer);
                this._arena._zero(pointer, 8);
                instance._isOrphan = true;
                return instance;
            }
        };
        Structure.prototype.disownAsReaderAddedInt8List = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 192
            };
            var instance = Builder_addedInt8List._READER._deref(this._arena, pointer);
            this._arena._zero(pointer, 8);
            instance._isOrphan = true;
            return instance;
        };
        Structure.prototype.hasAddedInt8List = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 192
            };
            return (!reader.isNull(pointer));
        };
        var Builder_addedStructField = scope["0xeab4d78288a545f6"];
        Structure.prototype.initAddedStructField = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 200
            };
            return Builder_addedStructField._init(this._arena, pointer, this._depth + 1);
        };
        Structure.prototype.getAddedStructField = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 200
            };
            if (reader.isNull(pointer)) {
                builder.copy.pointer.setStructPointer(this._defaults.addedStructField._arena, this._defaults.addedStructField._layout(), this._arena, pointer);
            }
            return Builder_addedStructField._deref(this._arena, pointer);
        };
        Structure.prototype.setAddedStructField = function(value) {
            if (Builder_addedStructField._TYPE !== value._TYPE) throw new TypeError();
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 200
            };
            Builder_addedStructField._set(this._arena, pointer, value);
        };
        Structure.prototype.adoptAddedStructField = function(value) {
            if (Builder_addedStructField._TYPE !== value._TYPE) throw new TypeError();
            if (!value._isOrphan) throw new ValueError('Cannot adopt non-orphans');
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 200
            };
            Builder_addedStructField._adopt(this._arena, pointer, value);
        };
        Structure.prototype.disownAddedStructField = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 200
            };
            if (reader.isNull(pointer)) {
                return Builder_addedStructField._initOrphan(this._arena);
            } else {
                var instance = Builder_addedStructField._deref(this._arena, pointer);
                this._arena._zero(pointer, 8);
                instance._isOrphan = true;
                return instance;
            }
        };
        Structure.prototype.disownAsReaderAddedStructField = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 200
            };
            var instance = Builder_addedStructField._READER._deref(this._arena, pointer);
            this._arena._zero(pointer, 8);
            instance._isOrphan = true;
            return instance;
        };
        Structure.prototype.hasAddedStructField = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 200
            };
            return (!reader.isNull(pointer));
        };
        Structure.prototype._defaults = Structure._READER.prototype._defaults;
        return Structure;
    })();
    module.exports = builders;
