define(['../reader/Arena'], function (Arena) {

    var fromStruct = function (instance) {
        var arena = instance._arena;
        if (arena._segments.length !== 1) {
            throw new Error('Need to implement nontrivial serialization (predicated on size within a single segment)');
        }
        var segment = arena._segments[0];

        if (segment.length === segment._position) return [segment];

        // @if TARGET_ENV='browser'
        var s = segment.subarray(0, segment._position);
        // @endif

        // @if TARGET_ENV='node'
        var s = segment.slice(0, segment._position);
        // @endif

        s._id = 0;
        s._position = segment._position;

        return s;
    };

    var toArena = function (blob) {
        return new Arena([blob]);
    };

    return {
        fromStruct : fromStruct,
        toArena : toArena
    };
});
