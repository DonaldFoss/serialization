define(['../layout/list'], function (layout) {

    return function (List) {
        var adopt = function (context, offset, value) {
            var meta = value._rt();
            var blob = {
                segment : value._segment,
                position : value._begin
            };

            if (meta.layout === 7) {
                blob.position -= 8;
            }

            layout.nonpreallocated(
                context._arena,
                {
                    segment : context._segment,
                    position : context._pointersSection + offset
                },
                blob,
                meta,
                value._length
            );

            value._isOrphan = false;
        };

        List._adoptField = function (offset) {
            return function (value) {
                if (!value._isOrphan)
                    throw new ValueError('Cannot adopt a non-orphan');

                if (!arena.isEquivTo(value._arena))
                    throw new ValueError('Cannot adopt from a different arena');

                adopt(this, offset, value);
            };
        };

        List._unionAdoptField = function (discr, offset) {
            return function (value) {
                if (!value._isOrphan)
                    throw new ValueError('Cannot adopt a non-orphan');

                if (!arena.isEquivTo(value._arena))
                    throw new ValueError('Cannot adopt from a different arena');

                this._setWhich(discr);
                adopt(this, offset, value);
            };
        };
    };
});
