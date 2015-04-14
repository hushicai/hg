/**
 * @file util
 * @author hushicai(bluthcy@gmail.com)
 */

/*eslint-env node*/

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

exports.getInstalledPkgs = function () {
    return fs.readdirSync(exports.getRootDirectory());
};

exports.isNameRepo = function (name) {
    return /@/.test(name);
};

exports.isUrlRepo = function (name) {
    return /\.git($|\?)/i.test(name);
};

exports.isRemotePkg = function (name) {
    return exports.isNameRepo(name) || exports.isUrlRepo(name);
};

exports.resolvePkgName = function (name) {
    var pkg;
    if (exports.isNameRepo(name)) {
        pkg = name.split('@')[1];
    }
    else if (exports.isUrlRepo(name)) {
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
    }
    else if (exports.isUrlRepo(name)) {
        url = name;
    }
    else {
        throw new Error('Unable to resolve repo url ' + name);
    }

    return url;
};

var Q = require('q');

exports.cloneRepo = function (name) {
    var url = exports.resolveRepoUrl(name);
    var src = exports.getPkgDirectory(name);
    var args = ['clone', url, src];
    var git = require('child_process').spawn('git', args, {
        stdio: 'inherit'
    });
    var deferred = Q.defer();

    git.on('close', function (code) {
        if (code !== 0) {
            deferred.reject(new Error(code));
            return;
        }

        deferred.resolve();
    });

    return deferred.promise;
};

exports.removePkg = function (pkg) {
    var src = exports.getPkgDirectory(pkg);

    return exports.removePkgDirectory(src);
};

exports.removePkgDirectory = function (dir) {
    require('./file').delete(dir);
};

/**
 * 执行shell command
 *
 * @public
 * @param {string} command 命令
 * @param {string} cwd cwd
 * @return {Promise}
 */
exports.execCommand = function (command, cwd) {
    var deferred = Q.defer();

    var chalk = require('chalk');

    console.log(
        chalk.cyan('running command ' + chalk.underline('"%s"') + ' ....'),
        command
    );

    command = command.split(' ');

    var cp = require('child_process').spawn(
        command.shift(),
        command,
        {
            cwd: cwd || process.cwd(),
            stdio: 'inherit'
        }
    );

    cp.on('close', function () {
        // 不管成功还是失败，继续执行下一个command
        return deferred.resolve();
    });

    return deferred.promise;
};

exports.execCommands = function (commands, cwd) {
    commands = commands || [];

    if (commands.length === 0) {
        return require('./q').rejected();
    }

    console.log('running commands ...');

    // promise waterfall
    return commands.reduce(function (soFar, command) {
        return soFar.then(function () {
            return exports.execCommand(command, cwd);
        });
    /*eslint-disable*/
    }, Q(true)).then(function () {
        console.log('completed!')
    });
    /*eslint-enable*/
};

exports.outputHelp = function (content) {
    if (content instanceof Array) {
        content = content.join('\n');
    }
    console.log(content);
};
