var path = require('path');
var spawn = require('child_process').spawn;
var fs = require('fs');
var when = require('when');
var node = require('when/node');
var PEG = require('pegjs');

module.exports = function (message, name) {
    return when.promise(function (resolve, reject) {
        var capnp = '';
        var err = '';
        var schema = path.resolve(__dirname, './testing.capnp');
        var decode = spawn('capnp', ['decode', '--flat', '--short', schema, name]);

        decode.stdin.end(message);

        decode.stdout.on('data', function (data) { capnp += data.toString(); });
        decode.stderr.on('data', function (data) { err += data.toString(); });

        decode.on('close', function (code) {
            if (code === 0) {
                var file = path.resolve(__dirname, './capnp.peg');
                resolve(
                    node.lift(fs.readFile)(file, {encoding:'utf-8'})
                        .then(function (grammar) {
                            var parser = PEG.buildParser(grammar.toString());
                            return parser.parse(capnp);
                        })
                );
            } else reject(err);
        });
    });
};
