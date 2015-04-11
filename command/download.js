/**
 * @file download
 * @author hushicai(bluthcy@gmail.com)
 */

var util = require('../lib/util');

exports.name = 'download';

exports.description = 'download a remote package';

exports.help = function () {
    var msg = [
        '  Usage: hg download <remote-pkg>'
    ];
    util.outputHelp(msg);
};

exports.process = function (argv) {
    var q = require('../lib/q');

    var name = argv._[0];

    if (!name) {
        this.help();
        return q.rejected();
    }

    if (util.isRemotePkg(name)) {
        return util.cloneRepo(name);
    }

    console.log('`%s` is not a remote pkg.', name);
    return q.rejected();
};
