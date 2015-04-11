/**
 * @file log
 * @author hushicai(bluthcy@gmail.com)
 */

/* eslint-env node */

var chalk = require('chalk');

exports.warn = function () {};

exports.error = function (msg, data) {
    console.log(chalk.red(msg), data);
};

exports.notice = function () {};
