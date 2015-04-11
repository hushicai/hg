/**
 * @file install
 * @author hushicai(bluthcy@gmail.com)
 */

var util = require('../lib/util');

exports.name = 'install';

exports.description = 'install a package';

exports.help = function () {
    var msg = [
        '  Usage: hg install [options] [pkg]',
        '  Options:',
        '    --dest    specific a directory to install pkg',
        '   --force    install pkg forcely',
        '  Examples:',
        '    hg install <pkg>',
        '    hg install <author@pkg>',
        '    hg install <git remote url>'
    ];

    return util.outputHelp(msg);
};

exports.process = function (argv) {
    var path = require('path');
    var fs = require('fs');
    var dest;
    var cwd = process.cwd();

    if (argv.dest) {
        dest = path.resolve(cwd, argv.dest);
    }
    else {
        dest = cwd;
    }

    var name = argv._[0];

    var q = require('../lib/q');

    if (!name) {
        this.help();
        return q.rejected();
    }

    var pkg = util.resolvePkgName(name);

    function doInstall() {
        var file = require('../lib/file');
        var pkgDirectory = util.getPkgDirectory(pkg);
        dest = path.join(dest, pkg);
        if (argv.force || !fs.existsSync(dest)) {
            file.copy(
                pkgDirectory,
                dest
            );

            return q.resolved();
        }
        console.log('`%s` exists, ignored!', dest);
        return q.rejected();
    }

    if (util.isInstalled(pkg)) {
        return doInstall();
    }

    if (util.isRemotePkg(name)) {
        return require('./download').process(argv).then(doInstall);
    }

    console.log('Unable to find package %s', name);
    return q.rejected();
};
