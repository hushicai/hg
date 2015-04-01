var Command = require('./Command');

function InitCommand() {
    Command.apply(this, arguments);
}

require('util').inherits(InitCommand, Command);

InitCommand.prototype.name = 'init';

InitCommand.prototype.run = function (argv) {
    var dest = process.cwd();

    var fs = require('fs');
    var path = require('path');
    var file = require('../lib/file');

    var dir = path.resolve(__dirname, '../template/init');

    fs.readdirSync(dir).forEach(function (filepath) {
        file.copy(path.join(dir, filepath), path.join(dest, filepath));
    });
};

InitCommand.prototype.description = function () {
    return 'init a hg generator';
};

module.exports = InitCommand;