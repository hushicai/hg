var Q = require('q');
var path = require('path');

exports.getHome = function () {
    var platform = require('os').platform();
    return process.env[platform === 'win32' ? 'USERPROFILE' : 'HOME'];
};

exports.getRootDirectory = function () {
    return path.join(exports.getHome(), '.hg');
};

exports.getPkgDirectory = function (name) {
    return path.join(exports.getRootDirectory(), name);
};

exports.isNameRepo = function (name) {
    return /@/.test(name);
};

exports.isUrlRepo = function (url) {
    return /\.git($|\?)/i.test(url);
};

exports.cloneNameRepo = function (name) {
    var url = ['github.com'];
    url = url.concat(name.split(/@/));
    url = 'https://' + url.join('/') + '.git';
    return exports.cloneRepo(url);
};


exports.cloneRepo = function (url) {
    var args = ['clone', url];
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