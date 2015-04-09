/**
 * @file rm
 * @author hushicai(bluthcy@gmail.com)
 */


var fs = require('fs');
var util = require('../lib/util');

exports.name = 'rm';

exports.process = function (argv) {
    var pkg = util.resolvePkgName(argv._[0]);
    var Q = require('q');

    function reject() {
        throw new Error('fail');
    }

    function resolve() {
        return true;
    }

    if (!pkg) {
        console.log('  Usage: hg rm [pkg]');
        return Q.fcall(reject);
    }

    var dir = util.getPkgDirectory(pkg);

    if (fs.existsSync(dir)) {
        require('../lib/file').delete(dir);
        return Q.fcall(resolve);
    }

    console.log('package "%s" does not exist', pkg);
    return Q.fcall(reject);
};

exports.description = 'remove a installed package';
