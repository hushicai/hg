/**
 * @file prompt
 * @author hushicai(bluthcy@gmail.com)
 */

var Q = require('Q');
var inquirer = require('inquirer');

exports.list = function (options) {
    options = options || {};
    var choices = options.choices || [];
    var message = options.message;
    var q = require('./q');
    if (choices.length === 0) {
        return q.rejected();
    }
    var deferred = Q.defer();
    inquirer.prompt({
        type: 'list',
        name: 'choice',
        message: message,
        choices: choices
    }, function (d) {
        return deferred.resolve(d.choice);
    });
    return deferred.promise;
};
