var adopt = require('./adopt');
var deref = require('./deref');
var init = require('./init');
var initOrphan = require('./initOrphan');
var set = require('./set');
    module.exports = {
        adopt: adopt,
        deref: deref,
        init: init,
        initOrphan: initOrphan,
        set: set,
        install: function(Nonstruct) {
            Nonstruct._deref = deref(Nonstruct);
            Nonstruct._adopt = adopt(Nonstruct);
            Nonstruct._init = init(Nonstruct);
            Nonstruct._initOrphan = initOrphan(Nonstruct);
            Nonstruct._set = set;
        }
    };
