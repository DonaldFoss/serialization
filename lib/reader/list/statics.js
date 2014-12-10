define(['../get', '../has', './deref'], function (
            get,      has,     deref) {

    return {
        deref : deref,
        get : get,
        has : has,
        install : function (Nonstruct) {
            deref(Nonstruct);
            get(Nonstruct);
            has(Nonstruct);
        }
    };
});
