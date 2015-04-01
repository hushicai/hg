var Command = require('./Command');

function InitCommand() {
    Command.apply(this, arguments);
}

require('util').inherits(InitCommand, Command);

InitCommand.prototype.name = 'init';

InitCommand.prototype.run = function (argv) {
    var dest = process.cwd();

    var rl = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.question('Are you sure to init a hg package here?(y/n): ', function (answer) {
        answer = answer.toLowerCase();
        if (answer === 'y' || answer === 'yes') {
            doInit();
        };
        rl.close();
    });

    function doInit() {
        var fs = require('fs');
        var path = require('path');
        var file = require('../lib/file');

        var dir = path.resolve(__dirname, '../template/init');

        fs.readdirSync(dir).forEach(function (filepath) {
            file.copy(path.join(dir, filepath), path.join(dest, filepath));
        });
    }
};

InitCommand.prototype.description = function () {
    return 'init a hg package';
};

module.exports = InitCommand;