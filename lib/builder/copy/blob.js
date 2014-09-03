define(['./deep'], function (deep) {

    /*
     * Deep copy a reader's contents into an arena without setting any pointers
     * to it.
     *
     * * reader Reader - The reader whose data will be copied into the arena.
     * * arena BuilderArena - The arena that will incorporate the data of
     *   `reader`.
     *
     * * RETURNS: Datum - The position of the incorporated data.
     */
    return function (reader, arena) {
        var layout = reader._layout();
        var blob;
        switch (layout.type) {
        case 0:
            blob = arena._allocate(layout.end - layout.dataSection);
            deep.setStructure(reader._arena, layout, arena, blob);
            return blob;

        case 1:
            var rt = reader._rt();
            var size = layout.dataBytes + layout.pointersBytes;
            var length = layout.length;

            // Use an additional 8 bytes if a tag word exists.
            var bytes = rt.size===0x07 ? 8+length*size : length*size;

            blob = arena._allocate(bytes);
            deep.setList(reader._arena, layout, arena, blob, size);

            return blob;

        default:
            throw new Error('Only structures and lists are supported');
        }
    };
});
