/**
 * @file 脚手架
 * @author hushicai(bluthcy@gmail.com)
 */

/* eslint-env node */

// 在指定目录中，生成`hg.json`中`files`指定的文件列表
//
var path = require('path');
var fs = require('fs');

var util = require('../lib/util');

exports.name = 'import';

exports.description = 'import files in a specificed directory.';

exports.help = function () {
    var msg = [
        '  Usage: hg scaffold [options] [pkg]',
        '  Options:',
        '    --dest         specific a directory to scaffold',
        '    --noscript     without running scripts'
    ];

    return util.outputHelp(msg);
};

exports.process = function (argv) {
    var name = argv._[0];
    var q = require('../lib/q');

    if (!name) {
        this.help();
        return q.rejected();
    }

    var pkg = util.resolvePkgName(name);
    var dest = argv.dest || process.cwd();

    function doImport() {
        var pkgDirectory = util.getPkgDirectory(pkg);
        var hgJsonFile = path.join(pkgDirectory, 'hg.json');

        if (!fs.existsSync(hgJsonFile)) {
            console.log('Not a hg package');
            return q.rejected();
        }

        var hgInfo = {};

        try {
            hgInfo = require(hgJsonFile);
        }
        catch (ex) {
            console.log('Unable to parse `%s`.', hgJsonFile);
            return q.rejected();
        }

        var file = require('../lib/file');
        var filesToCopy = file.glob(hgInfo.files, pkgDirectory);

        // 开始生成
        filesToCopy.forEach(function (filepath) {
            file.copy(
                path.resolve(pkgDirectory, filepath),
                path.resolve(dest, filepath)
            );
        });

        if (!argv.noscript) {
            return util.execCommands(hgInfo.scripts);
        }

        return q.resolved();
    }

    if (util.isInstalled(pkg)) {
        return doImport();
    }

    if (util.isRemotePkg(name)) {
        return require('./download').process(argv).then(doImport);
    }

    console.log('Unable to find package `%s`.', name);
    return q.rejected();
};
