var Command = require('./Command');

function InstallCommand() {
    Command.apply(this, arguments);
}

// 这个继承有点冷。。。
require('util').inherits(InstallCommand, Command);

InstallCommand.prototype.run = function (argv) {
    var minimist = require('minimist');
    var path = require('path');

    argv = minimist(argv);

    var dest;

    if (argv.dir) {
        dest = path.resolve(process.cwd(), argv.dir);
    }

    var name = argv._[0];

    if (!name) {
        return this.help();
    }

    var util = require('../lib/util');

    var pkg = util.resolvePkgName(name);

    if (util.isInstalled(pkg)) {
        util.generate(pkg, dest);
    }
    else if (util.isRepo(name)) {
        util.cloneRepo(name).then(function () {
            util.generate(pkg, dest);
        });
    }
    else {
        console.log('Unable to find package %s', name);
    }
};

InstallCommand.prototype.help = function () {
    console.log('\n  Usage: hg install [options] [pkg]');
    console.log('\n  Options:\n');
    console.log('\t-dir\tspecific a directory.');
    console.log('\n  Examples:\n');
    console.log('\thg install --dir=dir test');
};

InstallCommand.prototype.description = function () {
    return 'install a package';
};

module.exports = InstallCommand;