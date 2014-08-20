define([], function () {

    return {
        /*
         * The following algorithm for encoding base-64 strings to bytes was
         * copied with minimal modification from
         * https://github.com/beatgammit/base64-js.
         *
         * A few whitespace revisions have been made, and a `Uint8Array`
         * polyfill is assumed to exist (the author tested for its availability
         * and substituted `Array` in its absence).
         */
        base64 : function (b64) {
            /*
             * The MIT License (MIT)
             * Copyright (c) 2014
             * Permission is hereby granted, free of charge, to any person obtaining a copy
             * of this software and associated documentation files (the "Software"), to deal
             * in the Software without restriction, including without limitation the rights
             * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
             * copies of the Software, and to permit persons to whom the Software is
             * furnished to do so, subject to the following conditions:
             *
             * The above copyright notice and this permission notice shall be included in
             * all copies or substantial portions of the Software.
             *
             * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
             * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
             * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
             * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
             * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
             * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
             * THE SOFTWARE.
             */

            var i, j, l, tmp, placeHolders, arr;

            /*
             * the number of equal signs (place holders) if there are two
             * placeholders, than the two characters before it represent one
             * byte if there is only one, then the three characters before it
             * represent 2 bytes this is just a cheap hack to not do indexOf
             * twice.
             */
            var len = b64.length;
            placeHolders = '=' === b64.charAt(len - 2) ? 2 : '=' === b64.charAt(len - 1) ? 1 : 0;

            /* Base 64 is 4/3 + up to two characters of the original data. */
            arr = new Uint8Array(b64.length * 3 / 4 - placeHolders);

            /*
             * If there are placeholders, only get up to the last complete 4
             * characters.
             */
            l = placeHolders > 0 ? b64.length - 4 : b64.length;
            var L = 0;
            function push (v) {
                arr[L++] = v;
            }

            for (i = 0, j = 0; i < l; i += 4, j += 3) {
                tmp = (decode(b64.charAt(i)) << 18)
                    | (decode(b64.charAt(i + 1)) << 12)
                    | (decode(b64.charAt(i + 2)) << 6)
                    | decode(b64.charAt(i + 3));
                push((tmp & 0xFF0000) >> 16);
                push((tmp & 0xFF00) >> 8);
                push(tmp & 0xFF);
            }

            if (placeHolders === 2) {
                tmp = (decode(b64.charAt(i)) << 2)
                    | (decode(b64.charAt(i + 1)) >> 4);
                push(tmp & 0xFF);
            } else if (placeHolders === 1) {
                tmp = (decode(b64.charAt(i)) << 10)
                    | (decode(b64.charAt(i + 1)) << 4)
                    | (decode(b64.charAt(i + 2)) >> 2);
                push((tmp >> 8) & 0xFF);
                push(tmp & 0xFF);
            }

            return arr;
        }
    };
});
