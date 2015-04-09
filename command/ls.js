/**
 * @file ls
 * @author hushicai(bluthcy@gmail.com)
 */

/* eslint-env node  */

var util = require('../lib/util');

exports.name = 'ls';

exports.description = 'list all installed packages';

exports.help = function () {
    return util.outputHelp('  Usage: hg ls');
};

exports.process = function (argv) {
    var root = util.getRootDirectory();

    require('fs').readdirSync(root).forEach(function (filepath) {
        console.log(filepath);
    });
};
