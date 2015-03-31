var Command = require('./Command');

function RmCommand() {
    Command.apply(this, arguments);
}

require('util').inherits(RmCommand, Command);

RmCommand.prototype.run = function (argv) {
    var pkg = argv[0];

    if (!pkg) {
        console.log('usage: hg rm packageName');
        return;
    };

    var dir = require('../lib/util').getPkgDirectory(pkg);

    require('../lib/file').delete(dir);
};

module.exports = RmCommand;