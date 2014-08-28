define([], function () {

    return function (datum) {
        return !(
            datum.segment[datum.position-8]
         || datum.segment[datum.position-7]
         || datum.segment[datum.position-6]
         || datum.segment[datum.position-5]
         || datum.segment[datum.position-4]
         || datum.segment[datum.position-3]
         || datum.segment[datum.position-2]
         || datum.segment[datum.position-1]
        );
    };
});
