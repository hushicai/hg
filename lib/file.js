/**
 * @file file
 * @author hushicai(bluthcy@gmail.com)
 */

var fs = require('fs');
var path = require('path');

exports.defaultEncoding = 'utf8';

exports.read = function (srcFile, options) {
    try {
        var contents = fs.readFileSync(srcFile, options);

        // 判断encoding
        // 判断bom
        return contents;
    }
    catch (ex) {}
};

exports.write = function (destFile, contents, options) {
    options = options || {};
    exports.mkdir(path.dirname(destFile));

    try {
        fs.writeFileSync(destFile, contents, options);
        return true;
    }
    catch (ex) {
        throw new Error('Unable to write ' + destFile);
    }
};

exports.readJSON = function (srcFile) {
    var contents = exports.read(srcFile, {
        encoding: exports.defaultEncoding
    });

    try {
        return JSON.parse(contents);
    }
    catch (ex) {
        throw new Error('Unable to parse ' + srcFile);
    }
};

exports.delete = function (filepath) {
    try {
        require('rimraf').sync(filepath);
    }
    catch (ex) {
        console.log('Unable to delete %s', filepath);
    }
};

exports.mkdir = function (dir, mode) {
    if (mode === null) {
        mode = parseInt('0777', 8);
    }

    dir.split(path.sep).reduce(function (parts, part) {
        parts = parts + part + '/';
        var subpath = path.resolve(parts);
        if (!fs.existsSync(subpath)) {
            try {
                fs.mkdirSync(subpath, mode);
            }
            catch (ex) {
                throw new Error('Unable to create directory ' + subpath);
            }
        }
        return parts;
    }, '');
};

exports.copy = function (src, dest, options) {
    if (!fs.existsSync(src)) {
        throw new Error('Unable to copy ' + src);
    }

    if (fs.statSync(src).isDirectory()) {
        exports.mkdir(dest);
        fs.readdirSync(src).forEach(function (filepath) {
            exports.copy(
                path.join(src, filepath),
                path.join(dest, filepath),
                options
            );
        });
    }
    else {
        exports.copyFile(src, dest, options);
    }
};

exports.copyFile = function (srcFile, destFile, options) {
    options = options || {};

    options.encoding = options.encoding || null;

    var contents = exports.read(srcFile, options);

    if (contents) {
        exports.write(destFile, contents, options);
    }
};

exports.isHidden = function (basename) {
    return /^\./.test(basename);
};

exports.glob = function (pattern) {
    var glob = require('glob');
    if (typeof pattern === 'string') {
        pattern = [pattern];
    }

    var includes = [];
    var excludes = [];
    pattern.forEach(function (p) {
        if (p.charAt(0) === '!') {
            excludes = excludes.concat(glob.sync(p.substring(1)));
        }
        else {
            includes = includes.concat(glob.sync(p));
        }
    });

    var files = includes.filter(function (filepath) {
        return excludes.indexOf(filepath) === -1;
    });

    return files;
};
