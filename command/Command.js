

function Command() {}

Command.prototype.name = '';

Command.prototype.run = function (argv) {};

Command.prototype.help = function () {
    process.stdout.write(this.helpInformation());
};

Command.prototype.description = function () {};

module.exports = Command;