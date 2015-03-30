// 工厂
exports.getCommand = function (cmdName) {
    cmdName = cmdName.replace(/^\w/, function ($0) {
        return $0.toUpperCase();
    });

    var module = '../command/' + cmdName + 'Command';
    var Command = require(module);

    return new Command();
};