define(['../../reader/list/meta', './pointer'], function (
                           meta,     pointer) {

    // Deep layout copying.

    /*
     * Copy a structure to a blob of memory.
     *
     * arena Arena - The source structure's arena.
     * layout StructureLayout - Stripped reader data describing the structure to
     * be copied.
     * targetArena BuilderArena - The arena where the copied structure will be
     * written.
     * blob Datum - The location within `targetArena` to begin writing the list.
     */
    var setStruct = function (arena, layout, targetArena, blob) {
        var source = {
            segment : layout.segment,
            position : layout.dataSection
        };

        // Copy the data section verbatim.
        var dataLength = layout.pointersSection - layout.dataSection;
        targetArena._write(source, dataLength, blob);

        // Deep copy the pointers section.
        source.position += dataLength;
        var p = {
            segment : blob.segment,
            position : blob.position + dataLength
        };
        for (; source.position<layout.end; source.position+=8, p.position+=8) {
            pointer.setAnyPointer(arena, source, targetArena, p);
        }
    };

    var setOrphanStruct = function (arena, layout, targetArena) {
        return setStruct(
            arena,
            layout,
            targetArena,
            targetArena._allocateOrphan(layout.end-layout.dataSection)
        );
    };

    /*
     * Deep copy a list's pointers.  The list's non-pointers remain untouched.
     *
     * arena Arena - The source list's arena.
     * layout ListLayout - Stripped reader data describing the list to be
     * copied.
     * targetArena BuilderArena - The arena where the copied list will be
     * written.
     * blob Datum - The location within `targetArena` to begin writing the list.
     * For inline composite lists, this should reference the position
     * immediately following the list's tag.
     */
    var setListPointerSections = function (arena, layout, targetArena, blob) {
        var source = {
            segment : layout.segment,
            position : layout.begin
        };

        var target = {
            segment : blob.segment,
            position : blob.position
        };

        for (var i=0; i<layout.length; ++i) {
            var end = source.position + layout.pointersBytes;

            // Skip the data section.
            source.position += layout.dataBytes;
            target.position += layout.dataBytes;

            // Copy the pointer section.
            for (; source.position<end; source.position+=8, target.position+=8) {
                pointer.setAnyPointer(arena, source, targetArena, target);
            }
        }
    };

    /*
     * Copy the full list regardless of whether a particular item is a primitive
     * or a pointer.  Any copied pointers will still reference with respect to
     * `layout.segment` within `arena`.
     *
     * arena Arena - The source list's arena.
     * meta ListMeta - Metadata describing the pointer to be copied.
     * layout ListLayout - Reader data describing the list to be copied.
     * targetArena BuilderArena - The arena where the copied list will be
     * written.
     * blob Datum - The location within `targetArena` to begin writing the list.
     * size UInt32 - The size of each list element in bytes.
     */
    var setListVerbatim = function (arena, meta, layout, targetArena, blob) {
        var bytes;
        var source = {
            segment : layout.segment,
            position : layout.begin
        };

        if (meta.layout === 0x01) {
            bytes = layout.length >>> 3;
            var remainder = layout.length & 0x07;

            if (remainder) {
                // Clobber any junk on the tail of the source in preparation for
                // copying.
                source.segment[source.position + bytes] &= (0xff >>> (8-remainder));
                bytes += 1;
            }
        } else {
            bytes = layout.length * (layout.dataBytes + layout.pointersBytes);
        }

        targetArena._write(source, bytes, blob);
    };

    /*
     * Copy a list to a blob of memory.
     *
     * arena Arena - The source list's arena.
     * layout ListLayout - Stripped reader data describing the list to be
     * copied.
     * targetArena BuilderArena - The arena where the copied list will be
     * written.
     * blob Datum - The location within `targetArena` to begin writing the list.
     */
    var setList = function (arena, layout, targetArena, blob) {
        var m = meta(layout);

        var blob, data;
        if (m.layout === 0x07) {
            // Copy the tag word.
            targetArena._write({
                segment : layout.segment,
                position : layout.begin - 8
            }, 8, blob);

            data = {
                segment : blob.segment,
                position : blob.position + 8 // Skip the tag.
            };
        } else {
            data = blob;
        }

        if (layout.dataBytes !== 0)
            setListVerbatim(arena, m, layout, targetArena, data);

        if (layout.pointersBytes !== 0) {
            /*
             * Overwrite verbatim pointer copies with deep copies.  Since the
             * copying must succeed before linking into another data structure,
             * the parent data structure will not be corrupted upon failure.  If
             * the data structure isn't copied subsequent to such a failure,
             * however, any garbage will leak.
             */
            setListPointerSections(arena, layout, targetArena, data);
        }
    };

    var setOrphanList = function (arena, layout, targetArena) {
        return setList(
            arena,
            layout,
            targetArena,
            targetArena._allocateOrphan(layout.end-layout.dataSection)
        );
    };

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
    var setAny = function (arena, layout, targetArena, blob) {
        switch (layout.meta) {
        case 0: setStruct(arena, layout, targetArena, blob); return;
        case 1: setList(arena, layout, targetArena, blob); return;
        default: throw new Error('Only structures and lists are supported');
        }
    };

    var setOrphanAny = function (arena, layout, targetArena) {
        switch (layout.meta) {
        case 0: setOrphanStruct(arena, layout, targetArena); return;
        case 1: setOrphanList(arena, layout, targetArena); return;
        }
    };

    return {
        setStruct : setStruct,
        setOrphanStruct : setOrphanStruct,
        setList : setList,
        setOrphanList : setOrphanList,
        setAny : setAny,
        setOrphanAny : setOrphanAny
    }
});
