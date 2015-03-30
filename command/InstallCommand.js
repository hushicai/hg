var Command = require('./Command');

function InstallCommand() {
    Command.apply(this, arguments);
}

// 这个继承有点冷。。。
require('util').inherits(InstallCommand, Command);

InstallCommand.prototype.run = function (argv) {
    var name = argv[0];

    if (!name) {
        console.log('usage: hg install packageName');
        return;
    }

    var util = require('../lib/util');

    // TODO: 在命令行中指定目标目录
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

module.exports = InstallCommand;