var Command = require('./Command');

function LsCommand() {
    Command.apply(this, arguments);
}

require('util').inherits(LsCommand, Command);

LsCommand.prototype.name = 'ls';

LsCommand.prototype.run = function () {
    var util = require('../lib/util');

    var root = util.getRootDirectory();

    require('fs').readdirSync(root).forEach(function (filepath) {
        console.log(filepath);
    });
};

LsCommand.prototype.description = function () {
    return 'list all installed packages'
};

module.exports = LsCommand;