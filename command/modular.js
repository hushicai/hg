/**
 * @file modular
 * @author hushicai(bluthcy@gmail.com)
 */

/* eslint-env node  */

var util = require('../lib/util');

exports.name = 'modular';

exports.process = function (argv) {
    var filepath = argv._[0];

    if (!filepath) {
        return this.help();
    }

    // 生成文件
    var path = require('path');
    var file = require('../lib/file');

    filepath = filepath.lastIndexOf('.js') > 0 ? filepath : (filepath + '.js');

    var srcFile = path.resolve(__dirname, '../template/modular/main.js');
    var destFile = path.resolve(process.cwd(), filepath);

    var fs = require('fs');

    if (argv.f || argv.force || !fs.existsSync(destFile)) {
        file.copyFile(srcFile, destFile);
    }
    else {
        console.log('file "%s" exists', destFile);
    }
};

exports.help = function () {
    var msg = [
        '  Usage: hg modular [options] [file]',
        '  Options:',
        '    -f,--force    forcely generate a file'
    ];

    return util.outputHelp(msg);
};

exports.description = 'generate a modular js file';
