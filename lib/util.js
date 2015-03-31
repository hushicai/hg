var Q = require('q');
var path = require('path');
var fs = require('fs');

exports.getHome = function () {
    var platform = require('os').platform();
    return process.env[platform === 'win32' ? 'USERPROFILE' : 'HOME'];
};

exports.getRootDirectory = function () {
    return path.join(exports.getHome(), '.hg');
};

exports.getPkgDirectory = function (name) {
    var pkg = exports.resolvePkgName(name);
    return path.join(exports.getRootDirectory(), pkg);
};

exports.isInstalled = function (name) {
    return fs.existsSync(exports.getPkgDirectory(name));
};

exports.isNameRepo = function (name) {
    return /@/.test(name);
};

exports.isUrlRepo = function (name) {
    return /\.git($|\?)/i.test(name);
};

exports.isRepo = function (name) {
    return exports.isNameRepo(name) || exports.isUrlRepo(name);
};

exports.resolvePkgName = function (name) {
    var pkg;
    if (exports.isNameRepo(name)) {
        pkg = name.split('@')[1];
    } else if (exports.isUrlRepo(name)) {
        pkg = name.substring(name.lastIndexOf('/') + 1, name.lastIndexOf('.'));
    }
    else {
        pkg = name;
    }
    return pkg;
};

exports.resolveRepoUrl = function (name) {
    var url;
    if (exports.isNameRepo(name)) {
        url = ['github.com'].concat(name.split(/@/));
        url = 'https://' + url.join('/') + '.git';
    } else if (exports.isUrlRepo(name)) {
        url = name;
    } else {
        throw new Error('Unable to resolve repo url ' + name);
    }

    return url;
};


exports.cloneRepo = function (name) {
    var url = exports.resolveRepoUrl(name);
    var args = ['clone', url, exports.getPkgDirectory(name)];
    var git = require('child_process').spawn('git', args, {
        stdio: 'inherit'
    });
    var deferred = Q.defer();

    git.on('close', function (code) {
        if (code !== 0) {
            deferred.reject(new Error(code));
            return;
        };

        deferred.resolve();
    })

    return deferred.promise;
};

exports.generate = function (pkg, dest) {
    var src = exports.getPkgDirectory(pkg);

    if (!fs.existsSync(src)) {
        return console.log('Unable to find package %s', pkg);
    }

    dest = dest || process.cwd();

    var file = require('./file');

    // 添加版本号
    // try {
    //     var packageInfo = file.readJSON(
    //         path.join(src, 'package.json')
    //     );
    //     var version = packageInfo.version;

    //     dest = path.join(dest, version);
    // }
    // catch (ex) {}
    

    var filesToCopy = [];

    try {
        var template = require(path.resolve(src, 'template'));
        var filesToCopy = template.filesToCopy();
    }
    catch (ex) {
        // 过滤隐藏文件
        filesToCopy = fs.readdirSync(src).filter(function (filepath) {
            var basename = path.basename(filepath);

            return !/^\./.test(basename);
        });
    }

    console.log('install to %s', dest);

    var length = filesToCopy.length - 1;

    filesToCopy.forEach(function (filepath, index) {
        file.copy(
            path.resolve(src, filepath),
            path.resolve(dest, filepath)
        );

        if (index === length) {
            console.log('done');
        };
    });
};