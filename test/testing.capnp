@0xd3fc2b794ccf0e89;

struct WrapAny {
    anyField @0 :AnyPointer;
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
    anyList     @33 :List(WrapAny);
}

enum SecondEnum {
    uno    @0;
    dos    @1;
    tres   @2;
    quatro @3;
    sinko  @4;
}

struct SecondStruct {
    voidField        @0  :Void;
    boolField        @1  :Bool;
    int8Field        @2  :Int8;
    int16Field       @3  :Int16;
    int32Field       @4  :Int32;
    int64Field       @5  :Int64;
    uint8Field       @6  :UInt8;
    uint16Field      @7  :UInt16;
    uint32Field      @8  :UInt32;
    uint64Field      @9  :UInt64;
    float32Field     @10 :Float32;
    float64Field     @11 :Float64;
    textField        @12 :Text;
    dataField        @13 :Data;
    structField      @14 :SecondStruct;
    enumField        @15 :SecondEnum;
    anyField         @16 :AnyPointer;
    addedInt16Field  @34 :Int16 = -32015;
    addedEnumField   @35 :SecondEnum=quatro;
    addedStructField @40 :SecondStruct = (boolList=[false,true,false], enumField=sinko, uint8Field=253);

    voidList        @17 :List(Void);
    boolList        @18 :List(Bool);
    int8List        @19 :List(Int8);
    int16List       @20 :List(Int16);
    int32List       @21 :List(Int32);
    int64List       @22 :List(Int64);
    uint8List       @23 :List(UInt8);
    uint16List      @24 :List(UInt16);
    uint32List      @25 :List(UInt32);
    uint64List      @26 :List(UInt64);
    float32List     @27 :List(Float32);
    float64List     @28 :List(Float64);
    textList        @29 :List(Text);
    dataList        @30 :List(Data);
    structList      @31 :List(SecondStruct);
    enumList        @32 :List(SecondEnum);
    anyList         @33 :List(WrapAny);
    addedStructList @36 :List(SecondStruct);
    addedEnumList   @37 :List(SecondEnum);
    addedTextList   @38 :List(Text);
    addedInt8List   @39 :List(Int8);
}
