/**
 * @file q
 * @author hushicai(bluthcy@gmail.com)
 */

var Q = require('q');

exports.rejected = function (msg) {
    msg = msg || 'fail';
    return Q.fcall(function () {
        return new Error(msg);
    });
};


exports.resolved = function (value) {
    value = value || true;
    return Q.fcall(function () {
        return value;
    });
};
