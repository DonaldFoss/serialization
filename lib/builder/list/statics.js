define(['./deref', './adopt', './disown', './get', './has', './init', './set'], function (
           deref,     adopt,     disown,     get,     has,     init,     set) {

    return {
        deref : deref,
        adopt : adopt,
        disown : disown,
        get : get,
        has : has,
        init : init,
        set : set,
        install : function (Nonstruct) {
            deref(Nonstruct);
            adopt(Nonstruct);
            disown(Nonstruct);
            get(Nonstruct);
            has(Nonstruct);
            init(Nonstruct);
            set(Nonstruct);
        }
    };
});
