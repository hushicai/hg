/**
 * @file loaderConfig
 * @author hushicai(bluthcy@gmail.com)
 */

var fs = require('fs');
var util = require('../lib/util');

exports.name = 'loaderConfig';

exports.description = 'generate loader config';

exports.help = function () {
    var msg = [];
    return util.outputHelp(msg);
};

exports.process = function (argv) {
    var filename = argv._[0];
    var q = require('../lib/q');
    if (!filename) {
        this.help();
        return q.rejected();
    }
    var stats = fs.statSync(filename);
    if (!stats.isFile()) {
        console.log('`%s` not a file', filename);
        return q.rejected();
    }
    var path = require('path');
    var cwd = process.cwd();
    var dep = path.join(cwd, argv.dep || 'dep');
    var src = path.join(cwd, argv.src || 'src');
    var filepath = path.dirname(filename);
    var baseUrl = path.relative(filepath, src);
    var packages = [];
    if (fs.existsSync(dep)) {
        fs.readdirSync(dep).forEach(function (package) {
            packages.push({
                name: package,
                location: path.relative(filepath, path.join(dep, package, 'src')),
                main: 'main'
            });
        });
    }
    var tpl = fs.readFileSync(path.resolve(__dirname, '../template/loader/config.tpl'), 'utf8');
    var compiled = require('lodash').template(tpl);
    var result = compiled({
        baseUrl: baseUrl,
        packages: packages,
        lastIndex: packages.length - 1
    });
    console.log(result);
    return q.resolved();
};
