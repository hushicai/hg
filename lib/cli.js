var fs = require('fs');

exports.parse = function (argv) {
    // 删除node、hg-cli
    argv = argv.slice(2);

    var name = argv[0];

    if (!name) {
        // TODO: 打印帮助信息
        return;
    }

    
    var util = require('./util');

    // TODO: 在命令行中指定目标目录

        // author@repo
    if (util.isNameRepo(name)) {
        util.cloneNameRepo(name);
    }
    else {
        var file = require('./file');
        var src = util.getPkgDirectory(name);
        if (!fs.existsSync(src)) {
            throw new Error('Unable to find ' + name);
        };
        var dest = process.cwd();
        file.copy(src, dest);
    }
};