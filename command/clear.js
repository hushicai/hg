/**
 * @file clear
 * @author hushicai(bluthcy@gmail.com)
 */

var fs = require('fs');
var path = require('path');
var util = require('../lib/util');

exports.name = 'clear';

exports.description = 'clear hg packages';

exports.help = function () {
    var msg = [
        '  Usage: hg clear'
    ];
    return util.outputHelp(msg);
};

exports.process = function (argv) {
    var rootDirectory = util.getRootDirectory();

    var q = require('../lib/q');
    var file = require('../lib/file');
    fs.readdirSync(rootDirectory).forEach(function (filepath) {
        file.delete(
            path.resolve(rootDirectory, filepath)
        );
    });
    return q.resolved();
};
