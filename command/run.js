/**
 * @file run scripts
 * @author hushicai(bluthcy@gmail.com)
 */

/* eslint-env node */

var path = require('path');
var fs = require('fs');

exports.name = 'run';

exports.description = 'run scripts specificed in hg.json';

exports.process = function (argv) {
    var dir = process.cwd();
    var hgJsonFile = path.join(dir, 'hg.json');

    if (!fs.existsSync(hgJsonFile)) {
        console.log('Unable to find hg.json');
        return;
    }
    var hgInfo = {};

    try {
        hgInfo = require(hgJsonFile);
    }
    catch (ex) {}

    if (hgInfo.scripts) {
        require('../lib/util').execCommands(hgInfo.scripts);
    }
};
