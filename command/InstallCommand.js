var Command = require('./Command');

function InstallCommand() {
    Command.apply(this, arguments);
}

// 这个继承有点冷。。。
require('util').inherits(InstallCommand, Command);

InstallCommand.prototype.run = function (argv) {
    var name = argv[0];

    if (!name) {
        return this.help();
    }

    var util = require('../lib/util');

    var pkg = util.resolvePkgName(name);

    if (util.isInstalled(pkg)) {
        util.generate(pkg);
    }
    else if (util.isRepo(name)) {
        util.cloneRepo(name).then(function () {
            util.generate(pkg);
        });
    }
    else {
        console.log('Unable to find package %s', name);
    }
};

InstallCommand.prototype.help = function () {
    console.log('\n  Usage: hg install [options] [pkg]');
    console.log('\n  Options:\n');
    console.log('\t-d\tspecific a directory.');
};

InstallCommand.prototype.desc = function () {
    return 'install a package';
};

module.exports = InstallCommand;