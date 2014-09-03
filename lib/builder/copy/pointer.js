define(['./deep'], function (_deep) {

    var setPointer = {
        0 : _deep.setStructurePointer,
        1 : _deep.setListPointer
    };

    /*
     * Deep copy a reader's contents into an arena and set a pointer to link to
     * it.
     *
     * * reader Reader - The reader whose data will be copied into the arena.
     * * arena BuilderArena - The arena that will incorporate the data of
     *   `reader`.
     * * target Datum - Pointer location that will dereference to the copied
     *   data.
     *
     * * RETURNS: Datum - The provided pointer location that now dereferences to
     *   the copied data.
     */
    var deep = function (reader, arena, target) {
        /*
         * Zero the pointer so that failure results in a nulled pointer.  Upon
         * failure, copying will clean up any garbage.
         */
        arena._zero(target.segment, 8);

        var layout = reader._layout();
        setPointer[layout.type](reader._arena, layout, arena, target);

        return target;
    };

    /*
     * Set a pointer so that it dereferences as `orphan`.
     *
     * * orphan Reader - The data that `target` will dereference to.
     * * pointer Datum - Location of the pointer to set.
     *
     * * RETURNS: Datum - The provided pointer location that now dereferences to
     * the previously orphaned data.
     */
    var shallow = function (orphan, pointer) {
        var layout = orphan._layout();
        var blob;
        var rt = orphan._rt();
        switch (layout.type) {
        case 0:
            blob = {
                segment : layout.segment,
                position : layout.dataSection
            };
            structure.nonpreallocated(orphan._arena, pointer, blob, rt);
            return pointer;

        case 1:
            blob = {
                segment : layout.segment,
                position : layout.begin
            };

            // Include the tag word in the blob.
            if (rt.size === 0x07) { blob.position -= 8; }

            list.nonpreallocated(orphan._arena, pointer, blob, rt);

            return pointer;
        }
    };

    return {
        deep : deep,
        shallow : shallow
    };
});