/**
 * @file update
 * @author hushicai(bluthcy@gmail.com)
 */

var util = require('../lib/util');

exports.name = 'update';

exports.process = function (argv) {
    var pkg = argv._[0];
    var q = require('../lib/q');

    if (!pkg) {
        this.help();
        return q.rejected();
    }

    if (util.isInstalled(pkg)) {
        var command = 'git pull origin master';
        var pkgDirectory = util.getPkgDirectory(pkg);
        return util.execCommand(command, pkgDirectory);
    }

    console.log('Pkg `%s` not installed.', pkg);

    return q.rejected();
};

exports.help = function () {
    var msg = [
        '  Usage: hg update <remote-pkg>'
    ];
    return util.outputHelp(msg);
};

exports.description = 'update a package.';
