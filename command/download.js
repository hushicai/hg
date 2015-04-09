/**
 * @file download
 * @author hushicai(bluthcy@gmail.com)
 */

var util = require('../lib/util');

exports.name = 'download';

exports.description = 'download a remote package';

exports.help = function () {
    util.outputHelp('  Usage: hg download <author@pkg> | <git remote url>');
};

exports.process = function (argv) {
    var Q = require('q');

    function reject() {
        throw new Error('fail');
    }

    var name = argv._[0];

    if (!name) {
        this.help();
        return Q.fcall(reject);
    }

    if (util.isRemotePkg(name)) {
        return util.cloneRepo(name);
    }

    console.log('`%s` is not a remote pkg.', name);

    return Q.fcall(reject);
};
