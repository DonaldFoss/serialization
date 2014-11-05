var Allocator = require('capnp-js/builder/Allocator');
var reader = require('capnp-js/reader/index');
var scope = require('./rScope');
var constants = require('./constants');
    var readers = {};
    var allocator = new Allocator();
    readers.WrapAny = (function() {
        var Structure = scope["0xea60082ed1eb69e6"];
        Structure.prototype.getAnyField = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 0
            };
            if (pointer.position < this._end && !reader.isNull(pointer)) {
                return reader.AnyPointer._deref(this._arena, pointer, this._depth + 1);
            } else {
                return this._defaults.anyField;
            }
        };
        Structure.prototype._defaults = {
            anyField: (function() {
                var Reader = reader.AnyPointer;
                var arena = allocator._fromBase64("AAAAAAAAAAA=").asReader();
                return Reader._deref(arena, arena._root(), 0);
            })()
        };
        return Structure;
    })();
    readers.FirstEnum = scope['0xab928e839365df64'];
    readers.FirstStruct = (function() {
        var Structure = scope["0xd060e5f1a09c1c42"];
        Structure.prototype.getVoidField = function() {
            return null;
        };
        Structure.prototype.getBoolField = function() {
            var position = this._dataSection + 0;
            if (position < this._pointersSection) {
                return reader.fields.bool(0, this._segment, position, 0);
            } else {
                return !!0;
            }
        };
        Structure.prototype.getInt8Field = function() {
            var position = this._dataSection + 1;
            if (position < this._pointersSection) {
                return reader.fields.int8(0, this._segment, position);
            } else {
                return 0;
            }
        };
        Structure.prototype.getInt16Field = function() {
            var position = this._dataSection + 2;
            if (position < this._pointersSection) {
                return reader.fields.int16(0, this._segment, position);
            } else {
                return 0;
            }
        };
        Structure.prototype.getInt32Field = function() {
            var position = this._dataSection + 4;
            if (position < this._pointersSection) {
                return reader.fields.int32(0, this._segment, position);
            } else {
                return 0;
            }
        };
        Structure.prototype.getInt64Field = function() {
            var position = this._dataSection + 8;
            if (position < this._pointersSection) {
                return reader.fields.int64([0, 0], this._segment, position);
            } else {
                return [0, 0];
            }
        };
        Structure.prototype.getUint8Field = function() {
            var position = this._dataSection + 16;
            if (position < this._pointersSection) {
                return reader.fields.uint8(0, this._segment, position);
            } else {
                return 0;
            }
        };
        Structure.prototype.getUint16Field = function() {
            var position = this._dataSection + 18;
            if (position < this._pointersSection) {
                return reader.fields.uint16(0, this._segment, position);
            } else {
                return 0;
            }
        };
        Structure.prototype.getUint32Field = function() {
            var position = this._dataSection + 20;
            if (position < this._pointersSection) {
                return reader.fields.uint32(0, this._segment, position);
            } else {
                return 0;
            }
        };
        Structure.prototype.getUint64Field = function() {
            var position = this._dataSection + 24;
            if (position < this._pointersSection) {
                return reader.fields.uint64([0, 0], this._segment, position);
            } else {
                return [0, 0];
            }
        };
        Structure.prototype.getFloat32Field = function() {
            var position = this._dataSection + 32;
            if (position < this._pointersSection) {
                return reader.fields.float32(this._defaults.float32Field, this._segment, position);
            } else {
                return 0;
            }
        };
        Structure.prototype.getFloat64Field = function() {
            var position = this._dataSection + 40;
            if (position < this._pointersSection) {
                return reader.fields.float64(this._defaults.float64Field, this._segment, position);
            } else {
                return 0;
            }
        };
        Structure.prototype.getTextField = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 0
            };
            if (pointer.position < this._end && !reader.isNull(pointer)) {
                return reader.Text._deref(this._arena, pointer, this._depth + 1);
            } else {
                return this._defaults.textField;
            }
        };
        Structure.prototype.getDataField = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 8
            };
            if (pointer.position < this._end && !reader.isNull(pointer)) {
                return reader.Data._deref(this._arena, pointer, this._depth + 1);
            } else {
                return this._defaults.dataField;
            }
        };
        Structure.prototype.getStructField = (function() {
            var Reader = scope["0xd060e5f1a09c1c42"];
            return function() {
                var pointer = {
                    segment: this._segment,
                    position: this._pointersSection + 16
                };
                if (pointer.position < this._end && !reader.isNull(pointer)) {
                    return Reader._deref(this._arena, pointer, this._depth + 1);
                } else {
                    return this._defaults.structField;
                }
            };
        })();
        Structure.prototype.hasStructField = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 16
            };
            return pointer.position < this._end && !reader.isNull(pointer);
        };
        Structure.prototype.getEnumField = function() {
            var position = this._dataSection + 36;
            if (position < this._pointersSection) {
                return reader.fields.uint16(0, this._segment, position);
            } else {
                return 0;
            }
        };
        Structure.prototype.getAnyField = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 24
            };
            if (pointer.position < this._end && !reader.isNull(pointer)) {
                return reader.AnyPointer._deref(this._arena, pointer, this._depth + 1);
            } else {
                return this._defaults.anyField;
            }
        };
        Structure.prototype.getVoidList = (function() {
            var Reader = reader.lists.Void;
            return function() {
                var pointer = {
                    segment: this._segment,
                    position: this._pointersSection + 32
                };
                if (pointer.position < this._end && !reader.isNull(pointer)) {
                    return Reader._deref(this._arena, pointer, this._depth + 1);
                } else {
                    return this._defaults.voidList;
                }
            };
        })();
        Structure.prototype.hasVoidList = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 32
            };
            return pointer.position < this._end && !reader.isNull(pointer);
        };
        Structure.prototype.getBoolList = (function() {
            var Reader = reader.lists.Bool;
            return function() {
                var pointer = {
                    segment: this._segment,
                    position: this._pointersSection + 40
                };
                if (pointer.position < this._end && !reader.isNull(pointer)) {
                    return Reader._deref(this._arena, pointer, this._depth + 1);
                } else {
                    return this._defaults.boolList;
                }
            };
        })();
        Structure.prototype.hasBoolList = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 40
            };
            return pointer.position < this._end && !reader.isNull(pointer);
        };
        Structure.prototype.getInt8List = (function() {
            var Reader = reader.lists.Int8;
            return function() {
                var pointer = {
                    segment: this._segment,
                    position: this._pointersSection + 48
                };
                if (pointer.position < this._end && !reader.isNull(pointer)) {
                    return Reader._deref(this._arena, pointer, this._depth + 1);
                } else {
                    return this._defaults.int8List;
                }
            };
        })();
        Structure.prototype.hasInt8List = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 48
            };
            return pointer.position < this._end && !reader.isNull(pointer);
        };
        Structure.prototype.getInt16List = (function() {
            var Reader = reader.lists.Int16;
            return function() {
                var pointer = {
                    segment: this._segment,
                    position: this._pointersSection + 56
                };
                if (pointer.position < this._end && !reader.isNull(pointer)) {
                    return Reader._deref(this._arena, pointer, this._depth + 1);
                } else {
                    return this._defaults.int16List;
                }
            };
        })();
        Structure.prototype.hasInt16List = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 56
            };
            return pointer.position < this._end && !reader.isNull(pointer);
        };
        Structure.prototype.getInt32List = (function() {
            var Reader = reader.lists.Int32;
            return function() {
                var pointer = {
                    segment: this._segment,
                    position: this._pointersSection + 64
                };
                if (pointer.position < this._end && !reader.isNull(pointer)) {
                    return Reader._deref(this._arena, pointer, this._depth + 1);
                } else {
                    return this._defaults.int32List;
                }
            };
        })();
        Structure.prototype.hasInt32List = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 64
            };
            return pointer.position < this._end && !reader.isNull(pointer);
        };
        Structure.prototype.getInt64List = (function() {
            var Reader = reader.lists.Int64;
            return function() {
                var pointer = {
                    segment: this._segment,
                    position: this._pointersSection + 72
                };
                if (pointer.position < this._end && !reader.isNull(pointer)) {
                    return Reader._deref(this._arena, pointer, this._depth + 1);
                } else {
                    return this._defaults.int64List;
                }
            };
        })();
        Structure.prototype.hasInt64List = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 72
            };
            return pointer.position < this._end && !reader.isNull(pointer);
        };
        Structure.prototype.getUint8List = (function() {
            var Reader = reader.lists.UInt8;
            return function() {
                var pointer = {
                    segment: this._segment,
                    position: this._pointersSection + 80
                };
                if (pointer.position < this._end && !reader.isNull(pointer)) {
                    return Reader._deref(this._arena, pointer, this._depth + 1);
                } else {
                    return this._defaults.uint8List;
                }
            };
        })();
        Structure.prototype.hasUint8List = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 80
            };
            return pointer.position < this._end && !reader.isNull(pointer);
        };
        Structure.prototype.getUint16List = (function() {
            var Reader = reader.lists.UInt16;
            return function() {
                var pointer = {
                    segment: this._segment,
                    position: this._pointersSection + 88
                };
                if (pointer.position < this._end && !reader.isNull(pointer)) {
                    return Reader._deref(this._arena, pointer, this._depth + 1);
                } else {
                    return this._defaults.uint16List;
                }
            };
        })();
        Structure.prototype.hasUint16List = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 88
            };
            return pointer.position < this._end && !reader.isNull(pointer);
        };
        Structure.prototype.getUint32List = (function() {
            var Reader = reader.lists.UInt32;
            return function() {
                var pointer = {
                    segment: this._segment,
                    position: this._pointersSection + 96
                };
                if (pointer.position < this._end && !reader.isNull(pointer)) {
                    return Reader._deref(this._arena, pointer, this._depth + 1);
                } else {
                    return this._defaults.uint32List;
                }
            };
        })();
        Structure.prototype.hasUint32List = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 96
            };
            return pointer.position < this._end && !reader.isNull(pointer);
        };
        Structure.prototype.getUint64List = (function() {
            var Reader = reader.lists.UInt64;
            return function() {
                var pointer = {
                    segment: this._segment,
                    position: this._pointersSection + 104
                };
                if (pointer.position < this._end && !reader.isNull(pointer)) {
                    return Reader._deref(this._arena, pointer, this._depth + 1);
                } else {
                    return this._defaults.uint64List;
                }
            };
        })();
        Structure.prototype.hasUint64List = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 104
            };
            return pointer.position < this._end && !reader.isNull(pointer);
        };
        Structure.prototype.getFloat32List = (function() {
            var Reader = reader.lists.Float32;
            return function() {
                var pointer = {
                    segment: this._segment,
                    position: this._pointersSection + 112
                };
                if (pointer.position < this._end && !reader.isNull(pointer)) {
                    return Reader._deref(this._arena, pointer, this._depth + 1);
                } else {
                    return this._defaults.float32List;
                }
            };
        })();
        Structure.prototype.hasFloat32List = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 112
            };
            return pointer.position < this._end && !reader.isNull(pointer);
        };
        Structure.prototype.getFloat64List = (function() {
            var Reader = reader.lists.Float64;
            return function() {
                var pointer = {
                    segment: this._segment,
                    position: this._pointersSection + 120
                };
                if (pointer.position < this._end && !reader.isNull(pointer)) {
                    return Reader._deref(this._arena, pointer, this._depth + 1);
                } else {
                    return this._defaults.float64List;
                }
            };
        })();
        Structure.prototype.hasFloat64List = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 120
            };
            return pointer.position < this._end && !reader.isNull(pointer);
        };
        Structure.prototype.getTextList = (function() {
            var Reader = reader.lists.Text;
            return function() {
                var pointer = {
                    segment: this._segment,
                    position: this._pointersSection + 128
                };
                if (pointer.position < this._end && !reader.isNull(pointer)) {
                    return Reader._deref(this._arena, pointer, this._depth + 1);
                } else {
                    return this._defaults.textList;
                }
            };
        })();
        Structure.prototype.hasTextList = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 128
            };
            return pointer.position < this._end && !reader.isNull(pointer);
        };
        Structure.prototype.getDataList = (function() {
            var Reader = reader.lists.Data;
            return function() {
                var pointer = {
                    segment: this._segment,
                    position: this._pointersSection + 136
                };
                if (pointer.position < this._end && !reader.isNull(pointer)) {
                    return Reader._deref(this._arena, pointer, this._depth + 1);
                } else {
                    return this._defaults.dataList;
                }
            };
        })();
        Structure.prototype.hasDataList = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 136
            };
            return pointer.position < this._end && !reader.isNull(pointer);
        };
        Structure.prototype.getStructList = (function() {
            var Reader = reader.lists.structure(scope['0xd060e5f1a09c1c42']);
            return function() {
                var pointer = {
                    segment: this._segment,
                    position: this._pointersSection + 144
                };
                if (pointer.position < this._end && !reader.isNull(pointer)) {
                    return Reader._deref(this._arena, pointer, this._depth + 1);
                } else {
                    return this._defaults.structList;
                }
            };
        })();
        Structure.prototype.hasStructList = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 144
            };
            return pointer.position < this._end && !reader.isNull(pointer);
        };
        Structure.prototype.getEnumList = (function() {
            var Reader = reader.lists.UInt16;
            return function() {
                var pointer = {
                    segment: this._segment,
                    position: this._pointersSection + 152
                };
                if (pointer.position < this._end && !reader.isNull(pointer)) {
                    return Reader._deref(this._arena, pointer, this._depth + 1);
                } else {
                    return this._defaults.enumList;
                }
            };
        })();
        Structure.prototype.hasEnumList = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 152
            };
            return pointer.position < this._end && !reader.isNull(pointer);
        };
        Structure.prototype.getAnyList = (function() {
            var Reader = reader.lists.structure(scope['0xea60082ed1eb69e6']);
            return function() {
                var pointer = {
                    segment: this._segment,
                    position: this._pointersSection + 160
                };
                if (pointer.position < this._end && !reader.isNull(pointer)) {
                    return Reader._deref(this._arena, pointer, this._depth + 1);
                } else {
                    return this._defaults.anyList;
                }
            };
        })();
        Structure.prototype.hasAnyList = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 160
            };
            return pointer.position < this._end && !reader.isNull(pointer);
        };
        Structure.prototype._defaults = {
            float32Field: (function() {
                return allocator._fromBase64("AAAAAA==").getSegment(0);
            })(),
            float64Field: (function() {
                return allocator._fromBase64("AAAAAAAAAAA=").getSegment(0);
            })(),
            textField: (function() {
                var Reader = reader.Text;
                var arena = allocator._fromBase64("AQAAAAoAAAAAAAAAAAAAAA==").asReader();
                return Reader._deref(arena, arena._root(), 0);
            })(),
            dataField: (function() {
                var Reader = reader.Data;
                var arena = allocator._fromBase64("AQAAAAIAAAA=").asReader();
                return Reader._deref(arena, arena._root(), 0);
            })(),
            structField: (function() {
                var Reader = scope["0xd060e5f1a09c1c42"];
                var arena = allocator._fromBase64("AAAAAAAAAAA=").asReader();
                return Reader._deref(arena, arena._root(), 0);
            })(),
            anyField: (function() {
                var Reader = reader.AnyPointer;
                var arena = allocator._fromBase64("AAAAAAAAAAA=").asReader();
                return Reader._deref(arena, arena._root(), 0);
            })(),
            voidList: (function() {
                var Reader = reader.lists.Void;
                var arena = allocator._fromBase64("AQAAAAAAAAA=").asReader();
                return Reader._deref(arena, arena._root(), 0);
            })(),
            boolList: (function() {
                var Reader = reader.lists.Bool;
                var arena = allocator._fromBase64("AQAAAAEAAAA=").asReader();
                return Reader._deref(arena, arena._root(), 0);
            })(),
            int8List: (function() {
                var Reader = reader.lists.Int8;
                var arena = allocator._fromBase64("AQAAAAIAAAA=").asReader();
                return Reader._deref(arena, arena._root(), 0);
            })(),
            int16List: (function() {
                var Reader = reader.lists.Int16;
                var arena = allocator._fromBase64("AQAAAAMAAAA=").asReader();
                return Reader._deref(arena, arena._root(), 0);
            })(),
            int32List: (function() {
                var Reader = reader.lists.Int32;
                var arena = allocator._fromBase64("AQAAAAQAAAA=").asReader();
                return Reader._deref(arena, arena._root(), 0);
            })(),
            int64List: (function() {
                var Reader = reader.lists.Int64;
                var arena = allocator._fromBase64("AQAAAAUAAAA=").asReader();
                return Reader._deref(arena, arena._root(), 0);
            })(),
            uint8List: (function() {
                var Reader = reader.lists.UInt8;
                var arena = allocator._fromBase64("AQAAAAIAAAA=").asReader();
                return Reader._deref(arena, arena._root(), 0);
            })(),
            uint16List: (function() {
                var Reader = reader.lists.UInt16;
                var arena = allocator._fromBase64("AQAAAAMAAAA=").asReader();
                return Reader._deref(arena, arena._root(), 0);
            })(),
            uint32List: (function() {
                var Reader = reader.lists.UInt32;
                var arena = allocator._fromBase64("AQAAAAQAAAA=").asReader();
                return Reader._deref(arena, arena._root(), 0);
            })(),
            uint64List: (function() {
                var Reader = reader.lists.UInt64;
                var arena = allocator._fromBase64("AQAAAAUAAAA=").asReader();
                return Reader._deref(arena, arena._root(), 0);
            })(),
            float32List: (function() {
                var Reader = reader.lists.Float32;
                var arena = allocator._fromBase64("AQAAAAQAAAA=").asReader();
                return Reader._deref(arena, arena._root(), 0);
            })(),
            float64List: (function() {
                var Reader = reader.lists.Float64;
                var arena = allocator._fromBase64("AQAAAAUAAAA=").asReader();
                return Reader._deref(arena, arena._root(), 0);
            })(),
            textList: (function() {
                var Reader = reader.lists.Text;
                var arena = allocator._fromBase64("AQAAAAoAAAAAAAAAAAAAAA==").asReader();
                return Reader._deref(arena, arena._root(), 0);
            })(),
            dataList: (function() {
                var Reader = reader.lists.Data;
                var arena = allocator._fromBase64("AQAAAAIAAAA=").asReader();
                return Reader._deref(arena, arena._root(), 0);
            })(),
            structList: (function() {
                var Reader = reader.lists.structure(scope['0xd060e5f1a09c1c42']);
                var arena = allocator._fromBase64("AQAAAAAAAAA=").asReader();
                return Reader._deref(arena, arena._root(), 0);
            })(),
            enumList: (function() {
                var Reader = reader.lists.UInt16;
                var arena = allocator._fromBase64("AQAAAAMAAAA=").asReader();
                return Reader._deref(arena, arena._root(), 0);
            })(),
            anyList: (function() {
                var Reader = reader.lists.structure(scope['0xea60082ed1eb69e6']);
                var arena = allocator._fromBase64("AQAAAAAAAAA=").asReader();
                return Reader._deref(arena, arena._root(), 0);
            })()
        };
        return Structure;
    })();
    readers.SecondEnum = scope['0xfafaa992930b34ff'];
    readers.SecondStruct = (function() {
        var Structure = scope["0xeab4d78288a545f6"];
        Structure.prototype.getVoidField = function() {
            return null;
        };
        Structure.prototype.getBoolField = function() {
            var position = this._dataSection + 0;
            if (position < this._pointersSection) {
                return reader.fields.bool(0, this._segment, position, 0);
            } else {
                return !!0;
            }
        };
        Structure.prototype.getInt8Field = function() {
            var position = this._dataSection + 1;
            if (position < this._pointersSection) {
                return reader.fields.int8(0, this._segment, position);
            } else {
                return 0;
            }
        };
        Structure.prototype.getInt16Field = function() {
            var position = this._dataSection + 2;
            if (position < this._pointersSection) {
                return reader.fields.int16(0, this._segment, position);
            } else {
                return 0;
            }
        };
        Structure.prototype.getInt32Field = function() {
            var position = this._dataSection + 4;
            if (position < this._pointersSection) {
                return reader.fields.int32(0, this._segment, position);
            } else {
                return 0;
            }
        };
        Structure.prototype.getInt64Field = function() {
            var position = this._dataSection + 8;
            if (position < this._pointersSection) {
                return reader.fields.int64([0, 0], this._segment, position);
            } else {
                return [0, 0];
            }
        };
        Structure.prototype.getUint8Field = function() {
            var position = this._dataSection + 16;
            if (position < this._pointersSection) {
                return reader.fields.uint8(0, this._segment, position);
            } else {
                return 0;
            }
        };
        Structure.prototype.getUint16Field = function() {
            var position = this._dataSection + 18;
            if (position < this._pointersSection) {
                return reader.fields.uint16(0, this._segment, position);
            } else {
                return 0;
            }
        };
        Structure.prototype.getUint32Field = function() {
            var position = this._dataSection + 20;
            if (position < this._pointersSection) {
                return reader.fields.uint32(0, this._segment, position);
            } else {
                return 0;
            }
        };
        Structure.prototype.getUint64Field = function() {
            var position = this._dataSection + 24;
            if (position < this._pointersSection) {
                return reader.fields.uint64([0, 0], this._segment, position);
            } else {
                return [0, 0];
            }
        };
        Structure.prototype.getFloat32Field = function() {
            var position = this._dataSection + 32;
            if (position < this._pointersSection) {
                return reader.fields.float32(this._defaults.float32Field, this._segment, position);
            } else {
                return 0;
            }
        };
        Structure.prototype.getFloat64Field = function() {
            var position = this._dataSection + 40;
            if (position < this._pointersSection) {
                return reader.fields.float64(this._defaults.float64Field, this._segment, position);
            } else {
                return 0;
            }
        };
        Structure.prototype.getTextField = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 0
            };
            if (pointer.position < this._end && !reader.isNull(pointer)) {
                return reader.Text._deref(this._arena, pointer, this._depth + 1);
            } else {
                return this._defaults.textField;
            }
        };
        Structure.prototype.getDataField = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 8
            };
            if (pointer.position < this._end && !reader.isNull(pointer)) {
                return reader.Data._deref(this._arena, pointer, this._depth + 1);
            } else {
                return this._defaults.dataField;
            }
        };
        Structure.prototype.getStructField = (function() {
            var Reader = scope["0xeab4d78288a545f6"];
            return function() {
                var pointer = {
                    segment: this._segment,
                    position: this._pointersSection + 16
                };
                if (pointer.position < this._end && !reader.isNull(pointer)) {
                    return Reader._deref(this._arena, pointer, this._depth + 1);
                } else {
                    return this._defaults.structField;
                }
            };
        })();
        Structure.prototype.hasStructField = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 16
            };
            return pointer.position < this._end && !reader.isNull(pointer);
        };
        Structure.prototype.getEnumField = function() {
            var position = this._dataSection + 36;
            if (position < this._pointersSection) {
                return reader.fields.uint16(0, this._segment, position);
            } else {
                return 0;
            }
        };
        Structure.prototype.getAnyField = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 24
            };
            if (pointer.position < this._end && !reader.isNull(pointer)) {
                return reader.AnyPointer._deref(this._arena, pointer, this._depth + 1);
            } else {
                return this._defaults.anyField;
            }
        };
        Structure.prototype.getVoidList = (function() {
            var Reader = reader.lists.Void;
            return function() {
                var pointer = {
                    segment: this._segment,
                    position: this._pointersSection + 32
                };
                if (pointer.position < this._end && !reader.isNull(pointer)) {
                    return Reader._deref(this._arena, pointer, this._depth + 1);
                } else {
                    return this._defaults.voidList;
                }
            };
        })();
        Structure.prototype.hasVoidList = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 32
            };
            return pointer.position < this._end && !reader.isNull(pointer);
        };
        Structure.prototype.getBoolList = (function() {
            var Reader = reader.lists.Bool;
            return function() {
                var pointer = {
                    segment: this._segment,
                    position: this._pointersSection + 40
                };
                if (pointer.position < this._end && !reader.isNull(pointer)) {
                    return Reader._deref(this._arena, pointer, this._depth + 1);
                } else {
                    return this._defaults.boolList;
                }
            };
        })();
        Structure.prototype.hasBoolList = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 40
            };
            return pointer.position < this._end && !reader.isNull(pointer);
        };
        Structure.prototype.getInt8List = (function() {
            var Reader = reader.lists.Int8;
            return function() {
                var pointer = {
                    segment: this._segment,
                    position: this._pointersSection + 48
                };
                if (pointer.position < this._end && !reader.isNull(pointer)) {
                    return Reader._deref(this._arena, pointer, this._depth + 1);
                } else {
                    return this._defaults.int8List;
                }
            };
        })();
        Structure.prototype.hasInt8List = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 48
            };
            return pointer.position < this._end && !reader.isNull(pointer);
        };
        Structure.prototype.getInt16List = (function() {
            var Reader = reader.lists.Int16;
            return function() {
                var pointer = {
                    segment: this._segment,
                    position: this._pointersSection + 56
                };
                if (pointer.position < this._end && !reader.isNull(pointer)) {
                    return Reader._deref(this._arena, pointer, this._depth + 1);
                } else {
                    return this._defaults.int16List;
                }
            };
        })();
        Structure.prototype.hasInt16List = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 56
            };
            return pointer.position < this._end && !reader.isNull(pointer);
        };
        Structure.prototype.getInt32List = (function() {
            var Reader = reader.lists.Int32;
            return function() {
                var pointer = {
                    segment: this._segment,
                    position: this._pointersSection + 64
                };
                if (pointer.position < this._end && !reader.isNull(pointer)) {
                    return Reader._deref(this._arena, pointer, this._depth + 1);
                } else {
                    return this._defaults.int32List;
                }
            };
        })();
        Structure.prototype.hasInt32List = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 64
            };
            return pointer.position < this._end && !reader.isNull(pointer);
        };
        Structure.prototype.getInt64List = (function() {
            var Reader = reader.lists.Int64;
            return function() {
                var pointer = {
                    segment: this._segment,
                    position: this._pointersSection + 72
                };
                if (pointer.position < this._end && !reader.isNull(pointer)) {
                    return Reader._deref(this._arena, pointer, this._depth + 1);
                } else {
                    return this._defaults.int64List;
                }
            };
        })();
        Structure.prototype.hasInt64List = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 72
            };
            return pointer.position < this._end && !reader.isNull(pointer);
        };
        Structure.prototype.getUint8List = (function() {
            var Reader = reader.lists.UInt8;
            return function() {
                var pointer = {
                    segment: this._segment,
                    position: this._pointersSection + 80
                };
                if (pointer.position < this._end && !reader.isNull(pointer)) {
                    return Reader._deref(this._arena, pointer, this._depth + 1);
                } else {
                    return this._defaults.uint8List;
                }
            };
        })();
        Structure.prototype.hasUint8List = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 80
            };
            return pointer.position < this._end && !reader.isNull(pointer);
        };
        Structure.prototype.getUint16List = (function() {
            var Reader = reader.lists.UInt16;
            return function() {
                var pointer = {
                    segment: this._segment,
                    position: this._pointersSection + 88
                };
                if (pointer.position < this._end && !reader.isNull(pointer)) {
                    return Reader._deref(this._arena, pointer, this._depth + 1);
                } else {
                    return this._defaults.uint16List;
                }
            };
        })();
        Structure.prototype.hasUint16List = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 88
            };
            return pointer.position < this._end && !reader.isNull(pointer);
        };
        Structure.prototype.getUint32List = (function() {
            var Reader = reader.lists.UInt32;
            return function() {
                var pointer = {
                    segment: this._segment,
                    position: this._pointersSection + 96
                };
                if (pointer.position < this._end && !reader.isNull(pointer)) {
                    return Reader._deref(this._arena, pointer, this._depth + 1);
                } else {
                    return this._defaults.uint32List;
                }
            };
        })();
        Structure.prototype.hasUint32List = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 96
            };
            return pointer.position < this._end && !reader.isNull(pointer);
        };
        Structure.prototype.getUint64List = (function() {
            var Reader = reader.lists.UInt64;
            return function() {
                var pointer = {
                    segment: this._segment,
                    position: this._pointersSection + 104
                };
                if (pointer.position < this._end && !reader.isNull(pointer)) {
                    return Reader._deref(this._arena, pointer, this._depth + 1);
                } else {
                    return this._defaults.uint64List;
                }
            };
        })();
        Structure.prototype.hasUint64List = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 104
            };
            return pointer.position < this._end && !reader.isNull(pointer);
        };
        Structure.prototype.getFloat32List = (function() {
            var Reader = reader.lists.Float32;
            return function() {
                var pointer = {
                    segment: this._segment,
                    position: this._pointersSection + 112
                };
                if (pointer.position < this._end && !reader.isNull(pointer)) {
                    return Reader._deref(this._arena, pointer, this._depth + 1);
                } else {
                    return this._defaults.float32List;
                }
            };
        })();
        Structure.prototype.hasFloat32List = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 112
            };
            return pointer.position < this._end && !reader.isNull(pointer);
        };
        Structure.prototype.getFloat64List = (function() {
            var Reader = reader.lists.Float64;
            return function() {
                var pointer = {
                    segment: this._segment,
                    position: this._pointersSection + 120
                };
                if (pointer.position < this._end && !reader.isNull(pointer)) {
                    return Reader._deref(this._arena, pointer, this._depth + 1);
                } else {
                    return this._defaults.float64List;
                }
            };
        })();
        Structure.prototype.hasFloat64List = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 120
            };
            return pointer.position < this._end && !reader.isNull(pointer);
        };
        Structure.prototype.getTextList = (function() {
            var Reader = reader.lists.Text;
            return function() {
                var pointer = {
                    segment: this._segment,
                    position: this._pointersSection + 128
                };
                if (pointer.position < this._end && !reader.isNull(pointer)) {
                    return Reader._deref(this._arena, pointer, this._depth + 1);
                } else {
                    return this._defaults.textList;
                }
            };
        })();
        Structure.prototype.hasTextList = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 128
            };
            return pointer.position < this._end && !reader.isNull(pointer);
        };
        Structure.prototype.getDataList = (function() {
            var Reader = reader.lists.Data;
            return function() {
                var pointer = {
                    segment: this._segment,
                    position: this._pointersSection + 136
                };
                if (pointer.position < this._end && !reader.isNull(pointer)) {
                    return Reader._deref(this._arena, pointer, this._depth + 1);
                } else {
                    return this._defaults.dataList;
                }
            };
        })();
        Structure.prototype.hasDataList = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 136
            };
            return pointer.position < this._end && !reader.isNull(pointer);
        };
        Structure.prototype.getStructList = (function() {
            var Reader = reader.lists.structure(scope['0xeab4d78288a545f6']);
            return function() {
                var pointer = {
                    segment: this._segment,
                    position: this._pointersSection + 144
                };
                if (pointer.position < this._end && !reader.isNull(pointer)) {
                    return Reader._deref(this._arena, pointer, this._depth + 1);
                } else {
                    return this._defaults.structList;
                }
            };
        })();
        Structure.prototype.hasStructList = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 144
            };
            return pointer.position < this._end && !reader.isNull(pointer);
        };
        Structure.prototype.getEnumList = (function() {
            var Reader = reader.lists.UInt16;
            return function() {
                var pointer = {
                    segment: this._segment,
                    position: this._pointersSection + 152
                };
                if (pointer.position < this._end && !reader.isNull(pointer)) {
                    return Reader._deref(this._arena, pointer, this._depth + 1);
                } else {
                    return this._defaults.enumList;
                }
            };
        })();
        Structure.prototype.hasEnumList = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 152
            };
            return pointer.position < this._end && !reader.isNull(pointer);
        };
        Structure.prototype.getAnyList = (function() {
            var Reader = reader.lists.structure(scope['0xea60082ed1eb69e6']);
            return function() {
                var pointer = {
                    segment: this._segment,
                    position: this._pointersSection + 160
                };
                if (pointer.position < this._end && !reader.isNull(pointer)) {
                    return Reader._deref(this._arena, pointer, this._depth + 1);
                } else {
                    return this._defaults.anyList;
                }
            };
        })();
        Structure.prototype.hasAnyList = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 160
            };
            return pointer.position < this._end && !reader.isNull(pointer);
        };
        Structure.prototype.getAddedInt16Field = function() {
            var position = this._dataSection + 38;
            if (position < this._pointersSection) {
                return reader.fields.int16(-32015, this._segment, position);
            } else {
                return -32015;
            }
        };
        Structure.prototype.getAddedEnumField = function() {
            var position = this._dataSection + 48;
            if (position < this._pointersSection) {
                return reader.fields.uint16(3, this._segment, position);
            } else {
                return 3;
            }
        };
        Structure.prototype.getAddedStructList = (function() {
            var Reader = reader.lists.structure(scope['0xeab4d78288a545f6']);
            return function() {
                var pointer = {
                    segment: this._segment,
                    position: this._pointersSection + 168
                };
                if (pointer.position < this._end && !reader.isNull(pointer)) {
                    return Reader._deref(this._arena, pointer, this._depth + 1);
                } else {
                    return this._defaults.addedStructList;
                }
            };
        })();
        Structure.prototype.hasAddedStructList = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 168
            };
            return pointer.position < this._end && !reader.isNull(pointer);
        };
        Structure.prototype.getAddedEnumList = (function() {
            var Reader = reader.lists.UInt16;
            return function() {
                var pointer = {
                    segment: this._segment,
                    position: this._pointersSection + 176
                };
                if (pointer.position < this._end && !reader.isNull(pointer)) {
                    return Reader._deref(this._arena, pointer, this._depth + 1);
                } else {
                    return this._defaults.addedEnumList;
                }
            };
        })();
        Structure.prototype.hasAddedEnumList = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 176
            };
            return pointer.position < this._end && !reader.isNull(pointer);
        };
        Structure.prototype.getAddedTextList = (function() {
            var Reader = reader.lists.Text;
            return function() {
                var pointer = {
                    segment: this._segment,
                    position: this._pointersSection + 184
                };
                if (pointer.position < this._end && !reader.isNull(pointer)) {
                    return Reader._deref(this._arena, pointer, this._depth + 1);
                } else {
                    return this._defaults.addedTextList;
                }
            };
        })();
        Structure.prototype.hasAddedTextList = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 184
            };
            return pointer.position < this._end && !reader.isNull(pointer);
        };
        Structure.prototype.getAddedInt8List = (function() {
            var Reader = reader.lists.Int8;
            return function() {
                var pointer = {
                    segment: this._segment,
                    position: this._pointersSection + 192
                };
                if (pointer.position < this._end && !reader.isNull(pointer)) {
                    return Reader._deref(this._arena, pointer, this._depth + 1);
                } else {
                    return this._defaults.addedInt8List;
                }
            };
        })();
        Structure.prototype.hasAddedInt8List = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 192
            };
            return pointer.position < this._end && !reader.isNull(pointer);
        };
        Structure.prototype.getAddedStructField = (function() {
            var Reader = scope["0xeab4d78288a545f6"];
            return function() {
                var pointer = {
                    segment: this._segment,
                    position: this._pointersSection + 200
                };
                if (pointer.position < this._end && !reader.isNull(pointer)) {
                    return Reader._deref(this._arena, pointer, this._depth + 1);
                } else {
                    return this._defaults.addedStructField;
                }
            };
        })();
        Structure.prototype.hasAddedStructField = function() {
            var pointer = {
                segment: this._segment,
                position: this._pointersSection + 200
            };
            return pointer.position < this._end && !reader.isNull(pointer);
        };
        Structure.prototype._defaults = {
            float32Field: (function() {
                return allocator._fromBase64("AAAAAA==").getSegment(0);
            })(),
            float64Field: (function() {
                return allocator._fromBase64("AAAAAAAAAAA=").getSegment(0);
            })(),
            textField: (function() {
                var Reader = reader.Text;
                var arena = allocator._fromBase64("AQAAAAoAAAAAAAAAAAAAAA==").asReader();
                return Reader._deref(arena, arena._root(), 0);
            })(),
            dataField: (function() {
                var Reader = reader.Data;
                var arena = allocator._fromBase64("AQAAAAIAAAA=").asReader();
                return Reader._deref(arena, arena._root(), 0);
            })(),
            structField: (function() {
                var Reader = scope["0xeab4d78288a545f6"];
                var arena = allocator._fromBase64("AAAAAAAAAAA=").asReader();
                return Reader._deref(arena, arena._root(), 0);
            })(),
            anyField: (function() {
                var Reader = reader.AnyPointer;
                var arena = allocator._fromBase64("AAAAAAAAAAA=").asReader();
                return Reader._deref(arena, arena._root(), 0);
            })(),
            voidList: (function() {
                var Reader = reader.lists.Void;
                var arena = allocator._fromBase64("AQAAAAAAAAA=").asReader();
                return Reader._deref(arena, arena._root(), 0);
            })(),
            boolList: (function() {
                var Reader = reader.lists.Bool;
                var arena = allocator._fromBase64("AQAAAAEAAAA=").asReader();
                return Reader._deref(arena, arena._root(), 0);
            })(),
            int8List: (function() {
                var Reader = reader.lists.Int8;
                var arena = allocator._fromBase64("AQAAAAIAAAA=").asReader();
                return Reader._deref(arena, arena._root(), 0);
            })(),
            int16List: (function() {
                var Reader = reader.lists.Int16;
                var arena = allocator._fromBase64("AQAAAAMAAAA=").asReader();
                return Reader._deref(arena, arena._root(), 0);
            })(),
            int32List: (function() {
                var Reader = reader.lists.Int32;
                var arena = allocator._fromBase64("AQAAAAQAAAA=").asReader();
                return Reader._deref(arena, arena._root(), 0);
            })(),
            int64List: (function() {
                var Reader = reader.lists.Int64;
                var arena = allocator._fromBase64("AQAAAAUAAAA=").asReader();
                return Reader._deref(arena, arena._root(), 0);
            })(),
            uint8List: (function() {
                var Reader = reader.lists.UInt8;
                var arena = allocator._fromBase64("AQAAAAIAAAA=").asReader();
                return Reader._deref(arena, arena._root(), 0);
            })(),
            uint16List: (function() {
                var Reader = reader.lists.UInt16;
                var arena = allocator._fromBase64("AQAAAAMAAAA=").asReader();
                return Reader._deref(arena, arena._root(), 0);
            })(),
            uint32List: (function() {
                var Reader = reader.lists.UInt32;
                var arena = allocator._fromBase64("AQAAAAQAAAA=").asReader();
                return Reader._deref(arena, arena._root(), 0);
            })(),
            uint64List: (function() {
                var Reader = reader.lists.UInt64;
                var arena = allocator._fromBase64("AQAAAAUAAAA=").asReader();
                return Reader._deref(arena, arena._root(), 0);
            })(),
            float32List: (function() {
                var Reader = reader.lists.Float32;
                var arena = allocator._fromBase64("AQAAAAQAAAA=").asReader();
                return Reader._deref(arena, arena._root(), 0);
            })(),
            float64List: (function() {
                var Reader = reader.lists.Float64;
                var arena = allocator._fromBase64("AQAAAAUAAAA=").asReader();
                return Reader._deref(arena, arena._root(), 0);
            })(),
            textList: (function() {
                var Reader = reader.lists.Text;
                var arena = allocator._fromBase64("AQAAAAoAAAAAAAAAAAAAAA==").asReader();
                return Reader._deref(arena, arena._root(), 0);
            })(),
            dataList: (function() {
                var Reader = reader.lists.Data;
                var arena = allocator._fromBase64("AQAAAAIAAAA=").asReader();
                return Reader._deref(arena, arena._root(), 0);
            })(),
            structList: (function() {
                var Reader = reader.lists.structure(scope['0xeab4d78288a545f6']);
                var arena = allocator._fromBase64("AQAAAAAAAAA=").asReader();
                return Reader._deref(arena, arena._root(), 0);
            })(),
            enumList: (function() {
                var Reader = reader.lists.UInt16;
                var arena = allocator._fromBase64("AQAAAAMAAAA=").asReader();
                return Reader._deref(arena, arena._root(), 0);
            })(),
            anyList: (function() {
                var Reader = reader.lists.structure(scope['0xea60082ed1eb69e6']);
                var arena = allocator._fromBase64("AQAAAAAAAAA=").asReader();
                return Reader._deref(arena, arena._root(), 0);
            })(),
            addedStructList: (function() {
                var Reader = reader.lists.structure(scope['0xeab4d78288a545f6']);
                var arena = allocator._fromBase64("AQAAAAAAAAA=").asReader();
                return Reader._deref(arena, arena._root(), 0);
            })(),
            addedEnumList: (function() {
                var Reader = reader.lists.UInt16;
                var arena = allocator._fromBase64("AQAAAAMAAAA=").asReader();
                return Reader._deref(arena, arena._root(), 0);
            })(),
            addedTextList: (function() {
                var Reader = reader.lists.Text;
                var arena = allocator._fromBase64("AQAAAAoAAAAAAAAAAAAAAA==").asReader();
                return Reader._deref(arena, arena._root(), 0);
            })(),
            addedInt8List: (function() {
                var Reader = reader.lists.Int8;
                var arena = allocator._fromBase64("AQAAAAIAAAA=").asReader();
                return Reader._deref(arena, arena._root(), 0);
            })(),
            addedStructField: (function() {
                var Reader = scope["0xeab4d78288a545f6"];
                var arena = allocator._fromBase64("AAAAAAcAGgAAAAAAAAAAAAAAAAAAAAAA/QAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABRAAAAGQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAAAAAAAAA==").asReader();
                return Reader._deref(arena, arena._root(), 0);
            })()
        };
        return Structure;
    })();
    module.exports = readers;
