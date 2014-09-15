define([], function () {

    return function (bytes) {
        var pad = bytes & 0x00000007;
        if (pad) {
            // Word alignment
            bytes += 8 - pad;
        }

        return bytes;
    };
});
