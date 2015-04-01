var fs = require('fs');

exports.parse = function (argv) {
    argv = argv.slice(2);
    argv = require('minimist')(argv);
    var cmd = require('./cmd');
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
            var desc = m.prototype.description();
            var name = m.prototype.name;
            if (desc && name) {
                var temp = name + new Array(12).join(' ');
                temp = temp.substring(0, 12);
                msg.push('    ' + temp + desc);
            };
        });
        process.stdout.write(msg.join('\n'));
        return false;
    };

    var command = cmd.getCommand(cmdName);

    return command.run(argv);
};