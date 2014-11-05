var reader = require('capnp-js/reader/index');
    var types = {};
    types["0xea60082ed1eb69e6"] = reader.structure(6, 0, 8);
    types['0xab928e839365df64'] = {
        UNO: 0,
        DOS: 1,
        TRES: 2
    };
    types["0xd060e5f1a09c1c42"] = reader.structure(7, 48, 168);
    types['0xfafaa992930b34ff'] = {
        UNO: 0,
        DOS: 1,
        TRES: 2,
        QUATRO: 3,
        SINKO: 4
    };
    types["0xeab4d78288a545f6"] = reader.structure(7, 56, 208);
    module.exports = types;
