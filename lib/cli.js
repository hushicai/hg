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
    var pkg = util.resolvePkgName(name);

    if (util.isInstalled(pkg)) {
        util.generate(pkg);
    } else if (util.isRepo(name)) {
        util.cloneRepo(name).then(function () {
            util.generate(pkg);
        });
    } else {
        console.log('Unable to find package %s', name);
    }
};