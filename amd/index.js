define([ "./reader/index", "./builder/index", "./arena" ], function(reader, builder, arena) {
    return {
        arena: arena,
        reader: reader,
        builder: builder
    };
});