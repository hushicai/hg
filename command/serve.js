/**
 * @file serve
 * @author hushicai(bluthcy@gmail.com)
 */


exports.name = 'serve';

exports.description = 'serve from directory';

exports.help = function () {};

exports.process = function (argv) {
    var path = require('path');
    var dir = path.resolve(argv.dir || '.');
    var connect = require('connect');
    var server = connect();
    // var serveFavicon = require('serve-favicon');
    var serveIndex = require('serve-index');
    var serveStatic = require('serve-static');
    var phpcgi = require('node-phpcgi');
    server
        // .use(serveFavicon())
        .use(function (req, res, next) {
            // console.log(req.url);
            next();
        })
        .use(phpcgi({documentRoot: dir}))
        .use(serveStatic(dir))
        .use(serveIndex(dir));

    var port = argv.port || 3000;

    // start the server
    server.listen(port, function () {
      console.log('\033[90mserving \033[36m%s\033[90m on port \033[96m%d\033[0m', dir, port);
    });
};
