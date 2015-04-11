/**
 * @file rm
 * @author hushicai(bluthcy@gmail.com)
 */


var fs = require('fs');
var util = require('../lib/util');

exports.name = 'rm';

exports.process = function (argv) {
    var pkg = argv._[0];
    var q = require('../lib/q');

    if (!pkg) {
        console.log('  Usage: hg rm [pkg]');
        return q.rejected();
    }

    var dir = util.getPkgDirectory(pkg);

    if (fs.existsSync(dir)) {
        util.removePkgDirectory(dir);
        return q.resolved();
    }

    console.log('Pkg "%s" does not exist', pkg);
    return q.rejected();
};

exports.description = 'remove a installed package';
