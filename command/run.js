/**
 * @file run scripts
 * @author hushicai(bluthcy@gmail.com)
 */

/* eslint-env node */

var path = require('path');
var fs = require('fs');

var util = require('../lib/util');

exports.name = 'run';

exports.description = 'run scripts specificed in hg.json';

exports.help = function () {
    var msg = [
        '  Usage: hg run [options]',
        '  Options:',
        '    --p    prompt scripts'
    ];
};

exports.process = function (argv) {
    var dir = process.cwd();
    var hgJsonFile = path.join(dir, 'hg.json');
    var q = require('../lib/q');

    if (!fs.existsSync(hgJsonFile)) {
        console.log('Unable to find hg.json');
        return q.rejected();
    }
    var hgInfo = {};

    try {
        hgInfo = require(hgJsonFile);
    }
    catch (ex) {
        return q.rejected();
    }

    var scripts = hgInfo.scripts;

    if (argv.p) {
        return require('../lib/prompt').list({
            message: 'What script do you want to run?',
            choices: scripts
        }).then(function (choice) {
            return util.execCommand(choice);
        });
    }

    return util.execCommands(hgInfo.scripts);
};
