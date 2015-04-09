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
        '    -dir    specific a directory to install',
        '  Examples:',
        '    hg install <pkg>',
        '    hg install <author@pkg>',
        '    hg install <git remote url>'
    ];

    return util.outputHelp(msg);
};

exports.process = function (argv) {
    var path = require('path');
    var dest;

    if (argv.dir) {
        dest = path.resolve(process.cwd(), argv.dir);
    }

    var name = argv._[0];

    var Q = require('q');

    function reject() {
        throw new Error('fail');
    }

    if (!name) {
        this.help();
        return Q.fcall(reject);
    }

    var pkg = util.resolvePkgName(name);

    function doInstall() {
        return util.install(pkg, dest);
    }

    if (util.isInstalled(pkg)) {
        return doInstall();
    }

    if (util.isRemotePkg(name)) {
        return require('./download').process(argv).then(doInstall);
    }

    console.log('Unable to find package %s', name);
    return Q.fcall(reject);
};
