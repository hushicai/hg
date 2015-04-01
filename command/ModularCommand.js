 var Command = require('./Command');

 function ModularCommand() {
    Command.apply(this, arguments);
 }

 require('util').inherits(ModularCommand, Command);

 ModularCommand.prototype.run = function (argv) {
    var filepath = argv._[0];

    if (!filepath) {
        return this.help();
    }

    // 生成文件
    var path = require('path');
    var file = require('../lib/file');

    filepath = filepath.lastIndexOf('.js') > 0 ? filepath : (filepath + '.js');

    var srcFile = path.resolve(__dirname, '../template/modular/main.js');
    var destFile = path.resolve(process.cwd(), filepath);

    var fs = require('fs');

    if (argv.f || argv.force || !fs.existsSync(destFile)) {
        file.copy(srcFile,destFile);
    } else {
        console.log('file "%s" exists', destFile);
    }
 };

 ModularCommand.prototype.helpInformation = function () {
    var msg = [
        '  Usage: hg modular [options] [file]',
        '  Options:',
        '    -f,--force    forcely generate a file'
    ];

    return msg.join('\n');
 };

 ModularCommand.prototype.description = function () {
    return 'generate a modular js file';
 };

 module.exports = ModularCommand;