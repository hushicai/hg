var Command = require('./Command');
var fs = require('fs');

function RmCommand() {
    Command.apply(this, arguments);
}

require('util').inherits(RmCommand, Command);

RmCommand.prototype.name = 'rm';

RmCommand.prototype.run = function (argv) {
    var pkg = argv._.shift();

    if (!pkg) {
        console.log('  Usage: hg rm [pkg]');
        return;
    };

    var dir = require('../lib/util').getPkgDirectory(pkg);

    if (fs.existsSync(dir)) {
        require('../lib/file').delete(dir);
    }
    else {
        console.log('package "%s" does not exist', pkg);
    }
};

RmCommand.prototype.description = function () {
    return 'remove a installed package';
};

module.exports = RmCommand;