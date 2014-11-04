define(['../reader/layout/index', '../reader/isNull', '../reader/far', '../reader/list/meta',     './far', './layout/index', './shiftOffset'], function (
            reader,                          isNull,       farReader,                  meta,  farBuilder,          builder,     shiftOffset) {

    /*
     * Update a far pointer with its list or structure pointer if it is local to
     * `blob`.
     *
     * * arena BuilderArena - Arena that owns `pointer`.
     * * pointer Datum - New pointer location, filled with the initial pointer's
     *   data.  If the blob remains nonlocal, then no-op.
     */
    var far = function (arena, pointer) {
        var doubleFar = !!(pointer.segment[pointer.position] & 0x04);
        var blob = farReader.next(arena, pointer);
        if (doubleFar) blob = farReader.next(arena, blob);

        if (pointer.segment === blob.segment) {
            // The blob is now local
            var offset = pointer.position + 8 - blob.position;
            var tag = farReader.tag(arena, pointer);
            arena._write(tag, 8, pointer);
            shiftOffset(pointer, offset);

            // Zero the landing pad.
            if (doubleFar) {
                // Double-far.
                tag.position -= 8;
                arena._zero(tag, 16);
            } else {
                // Single-far.
                arena._zero(tag, 8);
            }
        }
    };

    /*
     * Shift the offsets of a sequence of list or structure pointers.  Far
     * pointers and capabilities are left unaltered.
     *
     * * iTarget Datum - Position of the first pointer in the sequence.
     * * length UInt32 - Number of pointers in the sequence.
     * * delta Int33 - The shift to apply to each pointer's offset.
     */
    var intrasegmentMovePointers = function (iTarget, length, delta) {
        for (var i=0; i<length; ++i, iTarget.position+=8) {
            if (!isNull(iTarget)) {
                var typeBits = iTarget.segment[iTarget.position] & 0x03;
                if (typeBits === 0x00 || typeBits === 0x01) {
                    shiftOffset(iTarget, delta);
                }
            }
        }
    };

    /*
     * Move a sequence of list or structure pointers to another segment.  
     * * Local pointers become far pointer landing pads, so zero old far
     *   pointers and capabilities.
     * * Far pointers that remain on a non-local segment are left unaltered, but
     *   new locals get installed as such, zeroing any far pointer remnants.
     *
     * * arena Arena - The parent arena that the pointers will get moved within.
     * * iSource Datum - Position of the first pointer in the sequence.
     * * length UInt32 - Number of pointers in the sequence.
     * * iTarget Datum - Position where the moved pointers should be written.
     */
    var intersegmentMovePointers = function (arena, iSource, length, iTarget) {
        for (var i=0; i<length; ++i, iSource.position+=8, iTarget.position+=8) {
            if (!isNull(iTarget)) {
                var typeBits = iSource.segment[iSource.position] & 0x03;
                switch (typeBits) {
                case 0:
                case 1:
                    // Was local, so use the old pointer as a landing pad.
                    farBuilder.terminal(iTarget, iSource);
                    break;

                case 2:
                    /*
                     * Update the target pointer for possible locality with its
                     * blob, and discard the old far pointer.
                     */
                    far(arena, iTarget);
                    arena._zero(iSource, 8);

                // Shallow copies suffice for capabilities.
                }
            }
        }
    };

    /*
     * Upgrade an older-versioned structure to contain sufficient space for its
     * compiled version.
     *
     * * arena BuilderArena - The parent arena of the structure that will be
     *   upgraded.
     * * pointer Datum - Position of the pointer whose structure will be
     *   upgraded.
     * * ct StructureMeta - Compile-time metadata of the upgrade-targeted
     *   structure.
     */
    var structure = function (arena, pointer, ct) {
        var rtLength;
        var blob = arena._preallocate(
            pointer.segment,
            ct.dataBytes + ct.pointersBytes
        );

        var layout = reader.structure.unsafe(arena, pointer);
        rtLength = layout.pointersSection - layout.dataSection;

        // Verbatim copy of the data section.
        arena._write({
            segment : layout.segment,
            position : layout.dataSection
        }, rtLength, blob);

        // @if TARGET_ENV='node'
        arena._zero({
            segment : blob.segment,
            position : blob.position + rtLength
        }, ct.dataBytes - rtLength);
        // @endif

        // Set up pointers section source and target iterators.
        var iSource = {
            segment : layout.segment,
            position : layout.pointersSection
        };
        var iTarget = {
            segment : blob.segment,
            position : blob.position + ct.dataBytes
        };

        // Make a verbatim copy of the pointers section.
        rtLength = layout.end - layout.pointersSection;
        arena._write(iSource, rtLength, iTarget);

        if (layout.segment === blob.segment) {
            // Moving within the same segment
            intrasegmentMovePointers(
                iTarget,
                rtLength >>> 3,
                blob.position - layout.dataSection
            );

            // @if TARGET_ENV='node'
            arena._zero(iTarget, ct.pointersBytes - rtLength);
            // @endif

            // Clobber the old structure entirely.
            arena._zero({
                segment : layout.segment,
                position : layout.dataSection
            }, rtLength);

        } else {
            // Moving to another segment.
            intersegmentMovePointers(
                arena,
                iSource,
                rtLength >>> 3,
                iTarget
            );

            // @if TARGET_ENV='node'
            arena._zero(iTarget, ct.pointersBytes - rtLength);
            // @endif

            // Clobber the old structure's data section.
            arena._zero({
                segment : layout.segment,
                position : layout.dataSection
            }, rtLength);
        }

        builder.structure.preallocated(pointer, blob, ct);
    };

    /*
     * Upgrade a list's elements to contain sufficient space for its compiled
     * version.
     *
     * arena BuilderArena - The parent arena of the list that will be upgraded.
     * pointer Datum - Position of the pointer whose list will be upgraded.
     * ct ListMeta - Compile-time metadata of the upgrade-targeted list.
     */
    var list = function (arena, pointer, ct) {
        var layout = reader.list.unsafe(arena, pointer);

        var rt = meta(layout);

        var blob, begin;
        var bytes = ct.dataBytes + ct.pointersBytes;
        if (ct.layout === 0x07) {
            blob = arena._preallocate(pointer.segment, 8+layout.length*bytes);
            begin = blob.position + 8;
        } else {
            blob = arena._preallocate(pointer.segment, layout.length*bytes);
            begin = blob.position;
        }

        /*
         * Shift of the list's first pointer section (only useful for local
         * allocations).
         */
        var delta = begin - layout.begin;

        // Misalignment between compile-time structures and run-time structures.
        var mis = bytes - rt.dataBytes - rt.pointersBytes;

        var iSource = {
            segment : layout.segment,
            position : layout.begin
        };
        var iTarget = {
            segment : blob.segment,
            position : begin
        };

        var slop = {
            data : ct.dataBytes - rt.dataBytes,
            pointers : ct.pointersBytes - rt.pointersBytes
        };
        for (var i=0; i<layout.length; ++i) {
            // Verbatim copy the data section.
            arena._write(iSource, rt.dataBytes, iTarget);

            // Update iterator positions.
            iSource.position += rt.dataBytes;
            iTarget.position += rt.dataBytes;

            // @if TARGET_ENV='node'
            arena._zero(iTarget, slop.data);
            // @endif

            iTarget.position += slop.data;

            if (rt.encoding >= 0x06) {
                if (layout.segment === blob.segment) {
                    intrasegmentMovePointers(iTarget, rt.pointersBytes >>> 3, delta+i*mis);
                } else {
                    intersegmentMovePointers(arena, iSource, rt.pointersBytes >>> 3, iTarget);
                }
            }

            // @if TARGET_ENV='node'
            arena._zero(iTarget, slop.pointers);
            // @endif

            // Realign the target iterator.
            iTarget.position += slop.pointers;
        }

        builder.list.preallocated(pointer, blob, ct, layout.length);
    };

    return {
        list : list,
        structure : structure
    };
});
