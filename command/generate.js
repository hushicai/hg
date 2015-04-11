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

exports.name = 'generate';

exports.description = 'scaffold files in a specificed directory.';

exports.help = function () {
    var msg = [
        '  Usage: hg scaffold [options] [pkg]',
        '  Options:',
        '    --dest    specific a directory to scaffold'
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

    function doGenerate() {
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

        var glob = require('glob');
        var filesToCopy = [];
        hgInfo.files.forEach(function (filePattern) {
            filesToCopy = filesToCopy.concat(
                glob.sync(filePattern, {cwd: pkgDirectory})
            );
        });

        if (filesToCopy.length === 0) {
            console.log('Not files specificed!, `%s`.', JSON.stringify(hgInfo.files));
        }

        // 开始生成
        var file = require('../lib/file');
        filesToCopy.forEach(function (filepath) {
            file.copy(
                path.resolve(pkgDirectory, filepath),
                path.resolve(dest, filepath)
            );
        });

        return util.execCommands(hgInfo.scripts);
    }

    if (util.isInstalled(pkg)) {
        return doGenerate();
    }

    if (util.isRemotePkg(name)) {
        return require('./download').process(argv).then(doGenerate);
    }

    console.log('Unable to find package `%s`.', name);
    return q.rejected();
};
