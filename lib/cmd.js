var fs = require('fs');
var path = require('path');

// get command by name
exports.getCommand = function (cmdName) {
    cmdName = cmdName.replace(/^\w/, function ($0) {
        return $0.toUpperCase();
    });

    var m = path.resolve(__dirname, '../command/' + cmdName + 'Command.js');
    var Command = require(m);

    return new Command();
};

// get all commands
exports.getCommands = function () {
    var dir = path.resolve(__dirname, '../command');
    var commands = fs.readdirSync(dir);

    commands = commands.filter(function (filepath) {
        filepath = path.basename(filepath);
        return /^\w+Command/.test(filepath);
    });

    commands = commands.map(function (filepath) {
        return path.join(dir, filepath);
    });

    return commands;
};