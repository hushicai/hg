/**
 * @file run scripts
 * @author hushicai(bluthcy@gmail.com)
 */

/* eslint-env node */

var path = require('path');
var fs = require('fs');

var Command = require('./Command');

function RunCommand() {}

require('util').inherits(RunCommand, Command);

RunCommand.prototype.name = 'run';

RunCommand.prototype.description = function () {
    return 'run scripts specificed in hg.json';
};

RunCommand.prototype.run = function (argv) {
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

module.exports = RunCommand;
