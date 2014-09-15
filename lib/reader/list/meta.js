define(['./sizes'], function (sizes) {

    return function (layout) {
        if (layout.dataBytes === null) {
            return {
                meta : 0x01,
                layout : 0x01,
                dataBytes : layout.dataBytes,
                pointersBytes : layout.pointersBytes
            };
        } else if (layout.dataBytes + layout.pointersBytes > 8) {
            return {
                meta : 0x01,
                layout : 0x07,
                dataBytes : layout.dataBytes,
                pointersBytes : layout.pointersBytes
            };
        } else {
            return {
                meta : 0x01,
                layout : sizes[layout.dataBytes][layout.pointersBytes],
                dataBytes : layout.dataBytes,
                pointersBytes : layout.pointersBytes
            };
        }
    };
});
