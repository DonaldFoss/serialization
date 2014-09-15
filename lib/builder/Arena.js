define(['../reader/Arena', '../reader/layout/structure', '../wordAlign', './layout/structure', './copy/index', './upgrade'], function (
            Reader,            reader,                       wordAlign,              builder,     copy,           upgrade) {

    /* Require to initialize everything to zero:
     * * A union's discriminant isn't explicitly zeroed.
     * * Upgrading assumes that transfered data is overwriting zeros, leaving untouched allocation at default values
     */

    var Builder = function (alloc, zero, size) {
        if (size < 8) size = 8;

        this.__alloc = alloc;
        this.__zero = zero;
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
        return this.getRoot(Structure); // Upgraded to default for non-nulls
    };

    Builder.prototype.initOrphan = function (Type) {
        /*
         * Only builders expose `initOrphan`, so providing a reader will error
         * out, as it should.
         */
        return Type.initOrphan(arena);
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
        if (reader._CT.meta !== 0) throw new Error('Root must be a struct');

        copy.pointer.deep(reader, reader._arena, this._root());
    };

    Builder.prototype.adoptRoot = function (orphan) {
        if (orphan._arena !== this) {
            throw new Error('Cannot adopt the orphans of other arenas');
        }
        if (this._isRooted) {
            throw new Error('The arena already has a root.');
        }

        copy.pointer.shallow(orphan, this._root());
    };

    Builder.prototype._root = function () {
        if (this._isRooted) {
            return {
                segment : this._segments[0],
                position : 0
            };
        } else {
            var p = this._allocate(8);
            this._isRooted = true;

            return p;
        }
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
        bytes = wordAlign(bytes);

        // Greedily try to find sufficient space within `this._segments`.
        this._segments.forEach(function (segment) {
            var oldEnd = segment._position;
            if (oldEnd + bytes < segment.length) {
                segment._position += bytes;

                return {
                    segment : segment,
                    position : oldEnd
                };
            }
        });

        // Create a new segment.
        if (this._nextSize < bytes) this._nextSize = bytes;
        var segment = this.__alloc(this._nextSize);

        // Double size for next allocation.
        this._nextSize = this._nextSize << 1;

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
        bytes = wordAlign(bytes);

        var oldEnd = localSegment._position;
        if (oldEnd + bytes <= localSegment.length) {
            localSegment._position += bytes;

            return {
                segment : localSegment,
                position : oldEnd
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

    Builder.prototype._zero = function (pointer, length) {
        this.__zero(pointer.segment, pointer.position, length);
    };

    Builder.prototype._allocateOrphan = function (bytes) {
        if (this._isRooted) {
            return this._allocate(bytes);
        } else {
            // Leave space at head for the root pointer.
            var blob = this._allocate(bytes + 8);
            blob.position += 8;

            return blob;
        }
    };

    return Builder;
});
