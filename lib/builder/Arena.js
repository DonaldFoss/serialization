define(['../reader/Arena', '../reader/layout/structure', './layout/structure', './copy/index', './upgrade'], function (
            Reader,            reader,                               builder,     copy,           upgrade) {

    /* Require to initialize everything to zero:
     * * A union's discriminant isn't explicitly zeroed.
     * * Upgrading assumes that transfered data is overwriting zeros, leaving untouched allocation at default values
     */

    var Builder = function (alloc, size) {
        this._alloc = alloc;
        this._nextSize = size || 8192;
        this._segments = []; // Array of Uint8Array instances (with additional `_id` and `_position` attributes).
        this._isRooted = false; // state of 0,0 bytes (computable by isNull(this._segments[0]));
    };

    Builder.prototype.getSegment = function (id) {
        if (id >= this._segments.length) {
            throw new RangeError();
        }

        return this._segments[id];
    };

    Builder.prototype.asReader = function (maxDepth, maxBytes) {
        if (maxDepth===undefined) maxDepth = Infinity;
        if (maxBytes===undefined) maxBytes = Infinity;

        return new Reader(this._segments, maxDepth, maxBytes);
    };

    Builder.prototype.initRoot = function (Structure) {
        var blob = this._allocateRoot(Structure._CT);
        return this.getRoot(Structure);
    };

    Builder.prototype.getRoot = function (Structure) {
        var ct = Structure._CT;
        var root = this._root();
        var layout = reader.structure.safe(this, root);

        if (layout.pointersSection - layout.dataSection < ct.dataBytes
         || layout.end - layout.pointersSection < ct.pointersBytes) {
            upgrade.structure(this, root, ct);
        }

        return Structure.deref(this, layout.segment, 0);
    };

    Builder.prototype.setRoot = function (reader) {
        copy.pointer.deep(reader, reader._arena, this._root());
    };

    Builder.prototype.adoptRoot = function (orphan) {
        if (orphan._arena !== this) {
            throw new Error('Cannot adopt the orphans of other arenas');
        }
        if (this._isRooted) {
            throw new Error('The arena already has a root.');
        }

        // If `orphan` is a member of the arena and there is no root, then
        // `orphan` is in fact an orphan.
        copy.pointer.shallow(orphan, this._root());
    };

    Builder.prototype._root = function () {
        return {
            segment : this._segments[0],
            position : 0
        };
    };

    /*
     * Analogous to `this._nextSize++`, but the returned value is greater than
     * or equal to the provided `bytes` argument.
     */
    Builder.prototype._postincrementNextSize = function (bytes) {
        var next = this._nextSize;
        if (next < bytes) {
            next = bytes;
        }

        // Use double the returned value for the next allocation.
        this._nextSize = next << 1;

        return next;
    };

    /*
     * Allocate space on a segment.
     *
     * bytes UInt32 - Number of bytes sought.  This number must be word-aligned.
     *
     * RETURNS: Datum
     * * `segment` - The segment containing the allocated space.
     * * `position` - The word aligned offset into `segment` where the allocated
     *   space begins.  The "position" word choice is for generality across a
     *   few functions.
     */
    Builder.prototype._allocate = function (bytes) {
        var position;

        // Greedily try to find sufficient space within `this._segments`.
        this._segments.forEach(function (segment) {
            position = segment._position;
            if (segment.length - position > bytes) {
                segment._position += bytes;

                return {
                    segment : segment,
                    position : position
                };
            }
        });

        // Create a new segment.
        var segment = this._alloc(this._postincrementNextSize(bytes));
        segment._id = this._segments.length;
        segment._position = bytes;
        this._segments.push(segment);

        return {
            segment : segment,
            position : 0
        };
    };

    /*
     * Allocate a contiguous blob of memory of length `bytes` if available on
     * `localSegment`.  Allocate a length of `bytes+8` on any segment if length
     * `bytes` was unavailable on `localSegment`.  In the latter case, the
     * resulting datum will have its position set such that the 8 extra bytes
     * are located immediately prior:  00 00 00 00 00 00 00 00 (datum) 00*bytes.
     *
     * * localSegment Uint8Array - Existing blob to bias allocation toward.
     * * bytes UInt32 - Length of the sought memory blob.
     *
     * * RETURNS: Datum - Position of the allocated memory blob.  This blob is
     *   preceded by 8 bytes if the sought blob size could not be allocated on
     *   `localSegment`.
     */
    Builder.prototype._preallocate = function (localSegment, bytes) {
        var position = localSegment._position;
        if (position + bytes < localSegment.length) {
            localSegment._position += bytes;

            return {
                segment : localSegment,
                position : position
            };
        }

        /*
         * Provide leading space for a far pointer landing pad if there's
         * insufficient space on `localSegment`.
         */
        var datum = this._allocate(bytes + 8);
        datum.position += 8;

        return datum;
    };

    /*
     * Copy `length` bytes from `source` to `target`.
     *
     * source Datum
     * length UInt32
     * target Datum
     */
    Builder.prototype._write = function (source, length, target) {
        target.segment.set(
            source.segment.subarray(source.position, length),
            target.position
        );
    };

    /*
     * Helper to `this._allocateRoot` and `this._allocateOrphan`.
     */
    Builder.prototype._firstAllocate = function (bytes) {
        var blob = this._allocate(this._postincrementNextSize(bytes + 8));
        blob.position += 8;

        return blob;
    };

    Builder.prototype._allocateRoot = function (meta) {
        if (this._isRooted) {
            throw new Error('Allocated root a second time');
        }

        var blob;
        var bytes = meta.dataBytes + meta.pointersBytes;
        if (this._segments.length === 0) {
            blob = this._firstAllocate(bytes);
        } else {
            blob = this._preallocate(this._segments[0], bytes);
        }

        builder.preallocated(this._root, blob, meta);
        this._isRooted = true;

        return blob;
    };

    Builder.prototype._allocateOrphan = function (bytes) {
        if (this._segments.length === 0) {
            return this._firstAllocate(bytes);
        }

        return this._allocate(bytes);
    };

    return Builder;
});
