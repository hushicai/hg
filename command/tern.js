/**
 * @file tern
 * @author hushicai(bluthcy@gmail.com)
 */

exports.name = 'tern';

exports.description = 'init a tern config';

exports.help = function () {};

exports.process = function (argv) {
    var tpl;
    var q = require('../lib/q');
    var path = require('path');
    if (argv.requirejs) {
        tpl = path.resolve(__dirname, '../template/tern/requirejs.conf');
    }
    else if (argv.node) {
        tpl = path.resolve(__dirname, '../template/tern/node.conf');
    }
    else {
        tpl = path.resolve(__dirname, '../template/tern/default.conf');
    }

    var target = path.join(process.cwd(), '.tern-project');

    require('../lib/file').copy(tpl, target);

    return q.rejected();
};
