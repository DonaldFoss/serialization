define(['./structure'], function (structure) {

    return function (preferredListEncoding, dataBytes, pointersBytes, id, paramCount) {
        /*
         * All specializations aggregate in a single object, where each
         * specialization has its full path for a key.
         */
        var specials = {};

        var memoize = function (hash, parent, params, populate) {
            var Structure = specials[hash];
            if (Structure === undefined) {
                Structure = structure(
                    preferredListEncoding,
                    dataBytes,
                    pointersBytes,
                    hash
                );
                Structure._PARENT = parent;
                Structure._PARAMS = params;

                populate(Structure);

                specials[hash] = Structure;
            }

            return Structure;
        };

        var Generic = {
            _SCOPED_GENERICS : {},

            bindRootScope : function () {
                return this.memoizeScope(id, null);
            },

            bindScope : function (parent) {
                return this.memoizeScope(
                    parent._HASH + ':' + id,
                    parent
                );
            },

            memoizeScope : function (scopedHash, parent) {
                var ScopedGeneric = this._SCOPED_GENERICS[scopedHash];

                if (ScopedGeneric === undefined) {
                    ScopedGeneric = {
                        _memoize : function (specialHash, params) {
                            /*
                             * The plugin provides a `_populate` method to fill
                             * in the structure's fields and nodes.
                             */
                            return memoize(
                                specialHash,
                                parent,
                                params,
                                ScopedGeneric._populate
                            );
                        },
                        _bindParams : function (params) {
                            var hash = parent._HASH+':'+id+'|'+params.map(function (p) {
                                return p._HASH;
                            }).join('|');

                            return this._memoize(hash, params);
                        }
                    };

                    this._SCOPED_GENERICS[scopedHash] = ScopedGeneric;
                }

                return ScopedGeneric;
            }
        };

        return Generic;
    };
});
