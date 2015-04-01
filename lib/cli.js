var fs = require('fs');

exports.parse = function (argv) {
    argv = argv.slice(2);
   
    if (argv.length === 0) {
        console.log('\nUsage: hg [command] [options] [pkg]');
        return;
    };

    var cmd = require('./cmd');
    var cmdName = argv.shift();
    var command = cmd.getCommand(cmdName);

    return command.run(argv);
};