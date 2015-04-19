/**
 * @file cli
 * @author hushicai(bluthcy@gmail.com)
 */

var cmd = require('./cmd');
var util = require('./util');

exports.parse = function (argv) {
    argv = argv.slice(2);
    argv = require('minimist')(argv);
    var cmdName = argv._.shift();
    // 如果取不到子命令，就打印帮助信息
    if (!cmdName) {
        return exports.help();
    }

    var command = cmd.getCommand(cmdName);

    if (!command) {
        return exports.help();
    }

    if (argv.h || argv.help) {
        return command.help && command.help();
    }

    return command.process(argv);
    // return command.process(argv).then(function () {console.log(1);}, function () {console.log(2);});
};

exports.help = function () {
    var commands = cmd.getCommands();
    var msg = [
        '  Usage: hg [command] [argv]',
        '  Command:'
    ];
    commands.forEach(function (c) {
        var m = require(c);
        var desc = m.description;
        var name = m.name;
        if (desc && name) {
            var temp = name + new Array(20).join(' ');
            temp = temp.substring(0, 20);
            msg.push('    ' + temp + desc);
        }
    });
    util.outputHelp(msg);
    return false;
};
