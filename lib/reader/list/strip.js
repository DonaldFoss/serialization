define([], function () {

    return function (reader) {
        return {
            segment : reader._segment,
            begin : reader._begin,
            dataBytes : reader._dataBytes,
            pointersBytes : reader._pointersBytes,
            length : reader._length
        };
    };
});
