var safe = require('./safe');
var unsafe = require('./unsafe');
var subwordList = require('./subwordList');
var inlineCompositeList = require('./inlineCompositeList');
    var intrasegment = function(pointer) {
        if ((pointer.segment[pointer.position + 4] & 7) === 7) {
            return inlineCompositeList.intrasegment(pointer);
        } else {
            return subwordList.intrasegment(pointer);
        }
    };
    var intersegment = function(tag, blob) {
        if ((pointer.segment[pointer.position + 4] & 7) === 7) {
            return inlineCompositeList.intersegment(tag, blob);
        } else {
            return subwordList.intersegment(tag, blob);
        }
    };
    module.exports = {
        safe: safe(intrasegment, intersegment, 1),
        unsafe: unsafe(intrasegment, intersegment, 1),
        intrasegment: intrasegment,
        intersegment: intersegment
    };
