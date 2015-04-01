var Command = require('./Command');

function RmCommand() {
    Command.apply(this, arguments);
}

require('util').inherits(RmCommand, Command);

RmCommand.prototype.name = 'rm';

RmCommand.prototype.run = function (argv) {
    var pkg = argv._.shift();

    if (!pkg) {
        console.log('usage: hg rm packageName');
        return;
    };

    var dir = require('../lib/util').getPkgDirectory(pkg);

    require('../lib/file').delete(dir);
};

RmCommand.prototype.description = function () {
    return 'remove a installed package';
};

module.exports = RmCommand;