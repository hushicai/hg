// 工厂
exports.getCommand = function (cmdName) {
    cmdName = cmdName.replace(/^\w/, function ($0) {
        return $0.toUpperCase();
    });

    var m = '../command/' + cmdName + 'Command';
    var Command = require(m);

    return new Command();
};