/**
 * @file update
 * @author hushicai(bluthcy@gmail.com)
 */

var util = require('../lib/util');

exports.name = 'update';

exports.process = function (argv) {
    var pkg = argv._[0];

    function doUpdate(p) {
        var command = 'git pull origin master';
        var pkgDirectory = util.getPkgDirectory(p);
        return util.execCommand(command, pkgDirectory);
    }

    if (!pkg) {
        return require('../lib/prompt').list({
            message: 'What package do you want to update?',
            choices: util.getInstalledPkgs()
        }).then(doUpdate, exports.help);
    }

    if (util.isInstalled(pkg)) {
        return doUpdate(pkg);
    }

    console.log('`%s` not installed.', pkg);

    var q = require('../lib/q');
    return q.rejected();
};

exports.help = function () {
    var msg = [
        '  Usage: hg update [pkg]'
    ];
    return util.outputHelp(msg);
};

exports.description = 'update a package.';
