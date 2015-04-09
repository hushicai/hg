/**
 * @file update
 * @author hushicai(bluthcy@gmail.com)
 */

var util = require('../lib/util');

exports.name = 'update';

exports.process = function (argv) {
    var name = argv._[0];
    var Q = require('q');

    function reject() {
        throw new Error('fail');
    }

    if (!name) {
        this.help();
        return Q.fcall(reject);
    }

    var rm = require('./rm');
    var install = require('./install');

    return rm.process(argv).then(function () {
        return install.process(argv);
    });
};

exports.help = function () {
    var msg = [
        '  Usage: hg update [pkg]'
    ];
    return util.outputHelp(msg);
};

exports.description = 'update a package.';
