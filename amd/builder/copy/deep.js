define([ "../reader/layouts/any", "../reader/list/sizes", "./layout/structure", "./layout/list" ], function(any, sizes, structure, list) {
    /*
     * Copy a structure to a blob of memory.
     *
     * arena Arena - The source structure's arena.
     * layout StructureLayout - Stripped reader data describing the structure to
     * be copied.
     * targetArena BuilderArena - The arena where the copied structure will be
     * written.
     * blob Datum - The location within `targetArena` to begin writing the
     * structure.
     */
    var setStructure = function(arena, layout, targetArena, blob) {
        var source = {
            segment: layout.segment,
            position: layout.dataSection
        };
        var target = {
            segment: blob.segment,
            position: blob.position
        };
        var dataSize = layout.pointersSection - layout.dataSection;
        arena._write(source, dataSize, target);
        target.position += dataSize;
        for (;source.position < layout.end; source.position += 8, target.position += 8) {
            copy(arena, source, targetArena, target);
        }
    };
    /*
     * Copy a structure to a blob of memory and direct a pointer to it.
     *
     * arena Arena - The source structure's arena.
     * layout StructureLayout - Stripped reader data describing the structure to
     * be copied.
     * targetArena BuilderArena - The arena where the copied structure will be
     * written.
     * target Datum - The location within `targetArena` to write a pointer that
     * dereferences to the copied structure.
     */
    var setStructurePointer = function(arena, layout, targetArena, target) {
        var blob = targetArena._preallocate(target.segment, layout.end - layout.dataSection);
        setStructure(arena, layout, targetArena, blob);
        structure.preallocated(target, blob, {
            dataBytes: layout.pointersSection - layout.dataSection,
            pointersBytes: layout.end - layout.pointersSection
        });
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
    var setListPointerSections = function(arena, layout, targetArena, blob) {
        var source = {
            segment: layout.segment,
            position: layout.begin
        };
        var target = {
            segment: blob.segment,
            position: blob.position
        };
        for (var i = 0; i < layout.length; ++i) {
            var end = source.position + 8 * layout.pointersBytes;
            // Skip the data section.
            source.position += layout.dataBytes;
            target.position += layout.dataBytes;
            // Copy the pointer section.
            for (;source.position < end; source.position += 8, target.position += 8) {
                copy(arena, source, targetArena, target);
            }
        }
    };
    /*
     * Copy the full list regardless of whether a particular item is a primitive
     * or a pointer.  Any copied pointers will still reference with respect to
     * `layout.segment` within `arena`.
     *
     * arena Arena - The source list's arena.
     * layout ListLayout - Stripped reader data describing the list to be
     * copied.
     * targetArena BuilderArena - The arena where the copied list will be
     * written.
     * blob Datum - The location within `targetArena` to begin writing the list.
     * size UInt32 - The size of each list element in bytes.
     */
    var setListVerbatim = function(arena, layout, targetArena, blob, size) {
        var source = {
            segment: layout.segment,
            position: layout.begin
        };
        arena._write(source, layout.length * size, blob);
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
     * size UInt32 - The size of each list element in bytes.
     */
    var setList = function(arena, layout, targetArena, blob, size) {
        var data;
        if (layout.size === 7) {
            // Copy the tag word.
            var tag = {
                segment: layout.segment,
                position: layout.begin - 8
            };
            targetArena._write(tag, 8, blob);
            data = {
                segment: blob.segment,
                position: blob.position + 8
            };
        } else {
            data = blob;
        }
        if (layout.dataSection !== 0) {
            setListVerbatim(arena, layout, targetArena, data, size);
        }
        if (layout.pointerSection !== 0) {
            /*
             * Overwrite verbatim pointer copies with deep copies.  Since the
             * copying must succeed before linking into an internal data
             * structure, the data structure will not be corrupted upon failure.
             * If the data structure isn't copied subsequent to such a failure,
             * however, the garbage can leak to external clients.
             */
            setListPointerSections(arena, layout, targetArena, data);
        }
    };
    /*
     * Copy a list to a blob of memory and direct a pointer to it.
     *
     * arena Arena - The source list's arena.
     * layout ListLayout - Stripped reader data describing the list to be
     * copied.
     * targetArena BuilderArena - The arena where the copied list will be
     * written.
     * target Datum - The location within `targetArena` to write a pointer that
     * dereferences to the copied list.
     */
    var setListPointer = function(arena, layout, targetArena, target) {
        var size = layout.dataBytes + layout.pointersBytes;
        var meta = {
            dataBytes: layout.dataBytes,
            pointersBytes: layout.pointersBytes,
            size: layout.size,
            length: layout.length
        };
        var blob;
        if (meta.size === 7) {
            // Add an extra 8 bytes for the tag word.
            blob = arena._preallocate(target.segment, 8 + layout.length * size);
        } else if (meta.size === 1) {
            blob = arena._preallocate(target.segment, layout.length >>> 3 + (layout.length & 7 ? 1 : 0));
        } else {
            blob = arena._preallocate(target.segment, layout.length * size);
        }
        setList(arena, layout, targetArena, blob, size);
        list.preallocated(target, blob, meta);
    };
    /*
     * Deep copy the `source` datum's pointer to the `target` datum.
     *
     * arena ReaderArena - Arena that contains the source data.
     * source Datum - Position of a pointer within `arena`.
     * targetArena BuilderArena - Arena that the data will be copied into.
     * target Datum - Position of the pointer within arena that should
     * dereference to the data's copy.
     */
    var copy = function(arena, source, targetArena, target) {
        var layout = any.safe(arena, source);
        switch (layout.type) {
          case 0:
            setStructurePointer(arena, layout, targetArena, target);
            break;

          case 1:
            setListPointer(arena, layout, targetArena, target);
            break;
        }
        return target;
    };
    return {
        setStructurePointer: setStructurePointer,
        setListPointer: setListPointer,
        setStructure: setStructure,
        setList: setList
    };
});