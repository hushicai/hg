/**
 * @file init
 * @author hushicai(bluthcy@gmail.com)
 */

var util = require('../lib/util');

exports.help = function () {
    var msg = [
        '  Usage: hg init'
    ];
    util.outputHelp(msg);
};

exports.name = 'init';

exports.description = 'init a hg package';

exports.process = function (argv) {
    var dest = process.cwd();

    var rl = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.question('Sure to init a hg package here?(y/n): ', function (answer) {
        answer = answer.toLowerCase();
        if (answer === 'y' || answer === 'yes') {
            doInit();
        };
        rl.close();
    });

    function doInit() {
        var fs = require('fs');
        var path = require('path');
        var file = require('../lib/file');

        var srcFile = path.resolve(__dirname, '../template/init/hg.json');
        var destFile = path.join(dest, 'hg.json')

        file.copy(srcFile, destFile);
    }
};
