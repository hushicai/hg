var fs = require('fs');

// hg help
// hg help packageName
// hg init
// hg ls
// hg install packageName

exports.parse = function (argv) {
    // 删除node、hg-cli
    argv = argv.slice(2);

    if (argv.length === 0) {
        console.log('usage: hg [command] [argv]');
        return;
    };

    var cmd = require('./cmd');
    var cmdName = argv.shift();
    var command = cmd.getCommand(cmdName);

    return command.run(argv);
};