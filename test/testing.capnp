@0xd3fc2b794ccf0e89;

# There exist tests that reference specific offsets into the struct fields.  As
# long as proper upgrading practices are followed, no tests should break upon
# extension.

struct VoidWrap {
    prior     @0 :Void;
    int8Field @1 :Int8;
    textField @2 :Text;
}

struct BoolWrap {
    prior     @0 :Bool;
    int8Field @1 :Int8;
    textField @2 :Text;
}

struct Int8Wrap {
    prior     @0 :Int8;
    int8Field @1 :Int8;
    textField @2 :Text;
}

struct Int16Wrap {
    prior     @0 :Int16;
    int8Field @1 :Int8;
    textField @2 :Text;
}

struct Int32Wrap {
    prior     @0 :Int32;
    int8Field @1 :Int8;
    textField @2 :Text;
}

struct Int64Wrap {
    prior     @0 :Int64;
    int8Field @1 :Int8;
    textField @2 :Text;
}

struct UInt8Wrap {
    prior     @0 :UInt8;
    int8Field @1 :Int8;
    textField @2 :Text;
}

struct UInt16Wrap {
    prior     @0 :UInt16;
    int8Field @1 :Int8;
    textField @2 :Text;
}

struct UInt32Wrap {
    prior     @0 :UInt32;
    int8Field @1 :Int8;
    textField @2 :Text;
}

struct UInt64Wrap {
    prior     @0 :UInt64;
    int8Field @1 :Int8;
    textField @2 :Text;
}

struct Float32Wrap {
    prior     @0 :Float32;
    int8Field @1 :Int8;
    textField @2 :Text;
}

struct Float64Wrap {
    prior     @0 :Float64;
    int8Field @1 :Int8;
    textField @2 :Text;
}

struct AnyWrap {
    prior     @0 :AnyPointer;
    int8Field @1 :Int8;
    textField @2 :Text;
}

enum FirstEnum {
    uno  @0;
    dos  @1;
    tres @2;
}

struct FirstStruct {
    voidField    @0  :Void;
    boolField    @1  :Bool;
    int8Field    @2  :Int8;
    int16Field   @3  :Int16;
    int32Field   @4  :Int32;
    int64Field   @5  :Int64;
    uint8Field   @6  :UInt8;
    uint16Field  @7  :UInt16;
    uint32Field  @8  :UInt32;
    uint64Field  @9  :UInt64;
    float32Field @10 :Float32;
    float64Field @11 :Float64;
    textField    @12 :Text;
    dataField    @13 :Data;
    structField  @14 :FirstStruct;
    enumField    @15 :FirstEnum;
    anyField     @16 :AnyPointer;

    voidList    @17 :List(Void);
    boolList    @18 :List(Bool);
    int8List    @19 :List(Int8);
    int16List   @20 :List(Int16);
    int32List   @21 :List(Int32);
    int64List   @22 :List(Int64);
    uint8List   @23 :List(UInt8);
    uint16List  @24 :List(UInt16);
    uint32List  @25 :List(UInt32);
    uint64List  @26 :List(UInt64);
    float32List @27 :List(Float32);
    float64List @28 :List(Float64);
    textList    @29 :List(Text);
    dataList    @30 :List(Data);
    structList  @31 :List(FirstStruct);
    enumList    @32 :List(FirstEnum);
    anyList     @33 :List(AnyWrap);
}

enum SecondEnum {
    uno    @0;
    dos    @1;
    tres   @2;
    quatro @3;
    sinko  @4;
}

struct SecondEnumWrap {
    prior     @0 :SecondEnum;
    int8Field @1 :Int8;
    textField @2 :Text;
}

struct Upgrade(T) {
    prior       @0 :T;
    boolField   @3 :Bool;
    int8Field   @1 :Int8;
    uint32Field @4 :UInt32;
    textField   @2 :Text;
    dataField   @5 :Data;
    structField @6 :SecondStruct;

    int16List  @8  :List(Int16);
    voidList   @7  :List(Void);
    uint32List @9  :List(UInt32);
    textList   @10 :List(Text);
    dataList   @11 :List(Data);
}

struct SecondStruct {
    voidField :group {
        prior     @0  :Void;
        int8Field @41 :Int8;
        textField @42 :Text;
    }
    boolField :group {
        prior     @1  :Bool;
        int8Field @43 :Int8;
        textField @44 :Text;
    }
    int8Field :group {
        prior     @2  :Int8;
        int8Field @45 :Int8;
        textField @46 :Text;
    }
    int16Field :group {
        prior     @3  :Int16;
        int8Field @47 :Int8;
        textField @48 :Text;
    }
    int32Field :group {
        prior     @4  :Int32;
        int8Field @49 :Int8;
        textField @50 :Text;
    }
    int64Field :group {
        prior     @5  :Int64;
        int8Field @51 :Int8;
        textField @52 :Text;
    }
    uint8Field :group {
        prior     @6  :UInt8;
        int8Field @53 :Int8;
        textField @54 :Text;
    }
    uint16Field :group {
        prior     @7  :UInt16;
        int8Field @55 :Int8;
        textField @56 :Text;
    }
    uint32Field :group {
        prior      @8  :UInt32;
        int8Field @57 :Int8;
        textField @58 :Text;
    }
    uint64Field :group {
        prior      @9  :UInt64;
        int8Field @59 :Int8;
        textField @60 :Text;
    }
    float32Field :group {
        prior     @10 :Float32;
        int8Field @61 :Int8;
        textField @62 :Text;
    }
    float64Field :group {
        prior     @11 :Float64;
        int8Field @63 :Int8;
        textField @64 :Text;
    }
    textField :group {
        prior     @12 :Text;
        int8Field @65 :Int8;
        textField @66 :Text;
    }
    dataField :group {
        prior     @13 :Data;
        int8Field @67 :Int8;
        textField @68 :Text;
    }
    structField :group {
        prior     @14 :SecondStruct;
        int8Field @69 :Int8;
        textField @70 :Text;
    }
    enumField :group {
        prior     @15 :SecondEnum;
        int8Field @71 :Int8;
        textField @72 :Text;
    }
    anyField :group {
        prior     @16 :AnyPointer;
        int8Field @73 :Int8;
        textField @74 :Text;
    }
    addedInt16Field :group {
        prior     @34 :Int16 = -32015;
        int8Field @75 :Int8;
        textField @76 :Text;
    }
    addedEnumField :group {
        prior     @35 :SecondEnum = quatro;
        int8Field @77 :Int8;
        textField @78 :Text;
    }
    addedStructField :group {
        prior     @40 :SecondStruct = (
            uint8Field      = (prior = 253),
            enumField       = (prior = sinko),
            addedInt16Field = (prior = -31945),
            boolList        = (prior = [false, true, false])
        );
        int8Field @79 :Int8;
        textField @80 :Text;
    }

    voidList :group {
        prior     @17 :List(VoidWrap);
        int8Field @81 :Int8;
        textField @82 :Text;
    }
    boolList :group {
        prior     @18 :List(Bool);
        int8Field @83 :Int8;
        textField @84 :Text;
    }
    int8List :group {
        prior     @19 :List(Int8Wrap);
        int8Field @85 :Int8;
        textField @86 :Text;
    }
    int16List :group {
        prior     @20 :List(Int16Wrap);
        int8Field @87 :Int8;
        textField @88 :Text;
    }
    int32List :group {
        prior     @21 :List(Int32Wrap);
        int8Field @89 :Int8;
        textField @90 :Text;
    }
    int64List :group {
        prior     @22 :List(Int64Wrap);
        int8Field @91 :Int8;
        textField @92 :Text;
    }
    uint8List :group {
        prior     @23 :List(UInt8Wrap);
        int8Field @93 :Int8;
        textField @94 :Text;
    }
    uint16List :group {
        prior     @24 :List(UInt16Wrap);
        int8Field @95 :Int8;
        textField @96 :Text;
    }
    uint32List :group {
        prior     @25 :List(UInt32Wrap);
        int8Field @97 :Int8;
        textField @98 :Text;
    }
    uint64List :group {
        prior     @26  :List(UInt64Wrap);
        int8Field @99  :Int8;
        textField @100 :Text;
    }
    float32List :group {
        prior     @27  :List(Float32Wrap);
        int8Field @101:Int8;
        textField @102 :Text;
    }
    float64List :group {
        prior     @28  :List(Float64Wrap);
        int8Field @103 :Int8;
        textField @104 :Text;
    }
    textList :group {
        prior     @29  :List(Text);
        int8Field @105 :Int8;
        textField @106 :Text;
    }
    dataList :group {
        prior     @30  :List(Data);
        int8Field @107 :Int8;
        textField @108 :Text;
    }
    structList :group {
        prior     @31  :List(SecondStruct);
        int8Field @109 :Int8;
        textField @110 :Text;
    }
    enumList :group {
        prior     @32  :List(SecondEnumWrap);
        int8Field @111 :Int8;
        textField @112 :Text;
    }
    anyList :group {
        prior     @33  :List(AnyWrap);
        int8Field @113 :Int8;
        textField @114 :Text;
    }

    addedStructList :group {
        prior     @36  :List(Upgrade(SecondStruct)) = [(
            prior = (
                int8Field = (prior = -120),
                enumField = (prior = quatro),
                textList  = (prior = ["asdf", "qwerty"])
            )
        )];
        int8Field @115 :Int8;
        textField @116 :Text;
    }
    addedEnumList :group {
        prior     @37  :List(SecondEnumWrap);
        int8Field @117 :Int8;
        textField @118 :Text;
    }
    addedTextList :group {
        prior     @38  :List(Upgrade(Text)) = [(
            prior = "first"
        ), (
            prior = "second"
        ), (
            prior = "third"
        )];
        int8Field @119 :Int8;
        textField @120 :Text;
    }
    addedInt8List :group {
        prior     @39  :List(Int8Wrap) = [(
            prior = 1
        ), (
            prior = -93
        ), (
            prior = 4
        )];
        int8Field @121 :Int8;
        textField @122 :Text;
    }
}
