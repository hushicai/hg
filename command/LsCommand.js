var Command = require('./Command');

function LsCommand() {
    Command.apply(this, arguments);
}

require('util').inherits(LsCommand, Command);

LsCommand.prototype.run = function () {
    var util = require('../lib/util');

    var root = util.getRootDirectory();

    require('fs').readdirSync(root).forEach(function (filepath) {
        console.log(filepath);
    });
};

module.exports = LsCommand;