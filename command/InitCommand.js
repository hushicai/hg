var Command = require('./Command');

function InitCommand() {
    Command.apply(this, arguments);
}

require('util').inherits(InitCommand, Command);

InitCommand.prototype.run = function (argv) {
    
};