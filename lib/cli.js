var fs = require('fs');

exports.parse = function (argv) {
    argv = argv.slice(2);
    argv = require('minimist')(argv);
    var cmd = require('./cmd');
    var util = require('./util');
    var cmdName = argv._.shift();
    // 如果取不到子命令，就打印帮助信息
    if (!cmdName) {
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
                var temp = name + new Array(12).join(' ');
                temp = temp.substring(0, 12);
                msg.push('    ' + temp + desc);
            }
        });
        util.outputHelp(msg);
        return false;
    }

    var command = cmd.getCommand(cmdName);

    if (argv.h || argv.help) {
        return command.help();
    }

    return command.process(argv);
    // return command.process(argv).then(function () {console.log(1);}, function () {console.log(2);});
};
