var path = require('path');
var spawn = require('child_process').spawn;
var Buffers = require('buffers');
var when = require('when');

module.exports = function (capnp, name) {
    return when.promise(function (resolve, reject) {
        var message = new Buffers();
        var err = new Buffers();
        var schema = path.resolve(__dirname, './testing.capnp');
        var encode = spawn('capnp', ['encode', '--flat', schema, name]);

        encode.stdin.end(capnp);

        encode.stdout.on('data', function (data) { message.push(data); });
        encode.stderr.on('data', function (data) { err.push(data); });

        encode.on('close', function (code) {
            if (code === 0) resolve(message.toBuffer());
            else reject(err.toString());
        });
    });
};
