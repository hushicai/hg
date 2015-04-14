/**
 * @file q
 * @author hushicai(bluthcy@gmail.com)
 */

var Q = require('q');

exports.rejected = function (msg) {
    msg = msg || 'fail';
    return Q.reject(msg);
};


exports.resolved = function (value) {
    value = value || true;
    return Q(value);
};
