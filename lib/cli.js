var fs = require('fs');

exports.parse = function (argv) {
    // 删除node、hg-cli
    argv = argv.slice(2);

    var cmd = require('./cmd');
    if (argv.length === 0) {
        var commands = cmd.getCommands();
        console.log('\n  Usage: hg [command] [argv]');
        console.log('\n  Command:\n');
        commands.forEach(function (c) {
            var m = require(c);
            var desc = m.prototype.description();
            if (desc) {
                var name = cmd.getName(c);
                 console.log('\t' + name + '\t' + desc);
            };
        });
        return false;
    };

    var cmdName = argv.shift();
    var command = cmd.getCommand(cmdName);

    return command.run(argv);
};