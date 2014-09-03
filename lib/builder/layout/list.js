define(['../far', './structure'], function (far, structure) {

    var lo = function (pointer, size, length) {
        pointer.segment[pointer.position + 4] = (length << 3) | size;
        pointer.segment[pointer.position + 5] = length << 11;
        pointer.segment[pointer.position + 6] = length << 19;
        pointer.segment[pointer.position + 7] = length << 27;
    };

    var composite = function (pointer, blob, meta) {
        lo(
            pointer,
            0x07,
            meta.length * ((meta.dataBytes + meta.pointersBytes) >>> 3)
        );

        blob.segment[blob.position] = (meta.length << 2);
        blob.segment[blob.position + 1] = meta.length << 10;
        blob.segment[blob.position + 2] = meta.length << 18;
        blob.segment[blob.position + 3] = meta.length << 26;

        structure.wordCounts(blob, meta.dataBytes>>>3, meta.pointersBytes>>>3);
    };

    var intrasegment = function (pointer, blob, meta) {
        /* Non-bitshift to avoid possible sign-bit truncation. */
        var offset = (blob.position - pointer.position + 8) / 8;

        pointer.segment[pointer.position] = (offset << 2) | 0x01;
        pointer.segment[pointer.position + 1] = offset >>> 6;
        pointer.segment[pointer.position + 2] = offset >>> 14;
        pointer.segment[pointer.position + 3] = offset >>> 22;

        if (meta.size === 0x07) {
            composite(pointer, blob, meta);
        } else {
            lo(pointer, meta.size, meta.length);
        }
    };

    /* Preallocated blob includes an extra 8 bytes at its head for far pointer landing */
    var preallocated = function (pointer, blob, meta) {
        if (pointer.segment === blob.segment) {
            intrasegment(pointer, blob, meta);
        } else {
            var land = {
                segment : blob.segment,
                position : blob.position - 8
            };

            // Build the local pointer.
            land.segment[land.position] = 0x01; // Zero offset by construction.
            if (meta.size === 0x07) {
                composite(land, blob, meta);
            } else {
                lo(land, meta.size, meta.length);
            }

            // Point at the off-segment blob's local pointer.
            far.terminal(pointer, land);
        }
    };

    var intersegment = function (arena, pointer, blob, meta) {
        var land = arena._preallocate(pointer.segment, 8);

        if (land.segment === pointer.segment) {
            // Single hop allocation success.
            far.terminal(pointer, land);
            intrasegment(land, blob, meta);
        } else {
            // Double hop fallback.
            // `land` references the far pointer's tag word.
            land.segment[land.position] = 0x01;
            if (meta.size === 0x07) {
                composite(land, blob, meta);
            } else {
                lo(land, meta.size, meta.length);
            }

            // Update `land` to reference the far pointer's landing pad.
            land.position -= 8;
            
            far.preterminal(pointer, land);
            far.terminal(land, blob);
        }
    };

    var nonpreallocated = function (arena, pointer, blob, meta) {
        if (pointer.segment === blob.segment) {
            // Local reference.
            intrasegment(target, blob, meta);
        } else {
            // Nonlocal reference.
            intersegment(orphan._arena, pointer, blob, meta);
        }
    };

    return {
        preallocated : preallocated,
        nonpreallocated : nonpreallocated,
        intrasegment : intrasegment,
        intersegment : intersegment
    };
});
