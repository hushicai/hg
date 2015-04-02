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

exports.install = function (pkg, dest) {
    var src = exports.getPkgDirectory(pkg);

    if (!fs.existsSync(src)) {
        return console.log('Unable to find package %s', pkg);
    }

    dest = dest || process.cwd();

    var file = require('./file');
    var glob = require('glob');

    var filesToCopy = [];
    var hgJsonFile = path.join(src, 'hg.json');
    var hgInfo = {};

    if (fs.existsSync(hgJsonFile)) {
        var hgInfo;
        try {
            hgInfo = require(hgJsonFile);
        }
        catch (ex) {
            console.log('Unable to parse %s', hgJsonFile);
            return false;
        }

        hgInfo.files.forEach(function (filepath) {
            var temp = glob.sync(filepath, {cwd: src});
            filesToCopy = filesToCopy.concat(temp);
        });
    } else {
        filesToCopy = fs.readdirSync(src);
    }

    // 过滤文件
    // 去重
    filesToCopy = filesToCopy.filter(function (filepath) {
        var basename = path.basename(filepath);
        return !file.isHidden(basename)
            && basename !== 'README.md'
            && basename !== 'package.json'
            && basename !== 'hg.json';
    });

    var length = filesToCopy.length;

    if (length === 0) {
        console.log('No files, please check the `files` field in hg.json');
        return false;
    };

    console.log('Install "%s" to "%s"...', pkg, dest);

    filesToCopy.forEach(function (filepath, index) {
        file.copy(
            path.resolve(src, filepath),
            path.resolve(dest, filepath)
        );

        if (index === length - 1) {
            console.log('installed!');

            if (hgInfo.scripts) {
                console.log('running scripts...');
                exports.execCommands(hgInfo.scripts).then(complete);  
            }
        };
    });

    function complete() {
        console.log('complete!');
    }
};

var Q = require('q');

exports.execCommand = function (command) {
     var deferred = Q.defer();

    console.log('running command "%s"....', command);

    require('child_process').exec(
        command,
        {
            cwd: process.cwd(),
        },
        function (err, stdout, stderr) {
            if (err !== null) {
                console.log('command "%s", fail!', command);
            } else {
                console.log('command "%s", done!', command);
            }
            // 不管成功还是失败，继续执行下一个command
            return deferred.resolve();
        }
    );

    return deferred.promise;
};

exports.execCommands = function (commands) {
    commands = commands || [];

    if (commands.length === 0) {
        return Q(true);
    }

    // promise waterfall
    return commands.reduce(function (soFar, command) {
        return soFar.then(function () {
            return exports.execCommand(command)
        });
    }, Q(true));
};