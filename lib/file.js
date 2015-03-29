var fs = require('fs');
var path = require('path');

exports.defaultEncoding = 'utf8';

exports.read = function (srcFile, options) {
    try {
        var contents = fs.readFileSync(srcFile);

        // 判断encoding
        // 判断bom
        return contents;
    }
    catch (ex) {}
};

exports.write = function (destFile, contents, options) {
    exports.mkdir(path.dirname(destFile));
    try {
        fs.writeFileSync(destFile, contents);
        return true;
    }
    catch (ex) {
        throw new Error('Unable to write ' + destFile);
    }
};

exports.mkdir = function (dir, mode) {
    if (mode === null) {
        mode = parseInt('0777', 8);
    }

    dir.split(/[\/\\]/g).reduce(function (parts, part) {
        parts = parts + part + '/';
        subpath = path.resolve(parts);
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

// TODO: 只拷贝指定文件
exports.copy = function (src, dest, options) {
    if (!fs.existsSync(src)) {
        throw new Error('Unable to copy ' + src);
    }
    
    console.log('copy', src, 'to', dest);

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
    };
};
