// Load requirements
var http = require('http'),
    io = require('socket.io'),
    express = require('express.io'),
    app = express().http().io(),
    srv = app.server,
    slashes = require("connect-slashes"),
    ejs = require('ejs'),
    path = require('path');

/* IMPORTANT - No VAR Makes Variables Global */
config = require('./config');

/* Configuration */
app.configure(function () {
    //Express
    app.engine('htmlejs', ejs.renderFile);
    app.set('views', path.join(__dirname, 'views/'));
    app.set('view engine', 'ejs');
    app.set('x-powered-by', false);
    app.use(express.static('public'));
    app.use('/img', express.static(path.join(__dirname, 'public/img')));
    app.use(slashes(true));
    app.use(express.logger('dev'));
    app.use(express.compress());
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.cookieParser(config.cookie_session.secret));
    app.use(express.cookieSession({key: config.cookie_session.key}));
});

/* Development Only */
app.configure('development', function () {

});

/* Production Only */
app.configure('production', function () {
    process.on('uncaughtException', function (error) {
        console.log("Uncaught Error: " + error.stack);
        return false;
    });
});

/* Express: Start Router */
app.use(app.router);

/* Express: Import Routes */
require('./routes')(app);

/* Socket IO: Configuration */
app.io.configure(function () {
    app.io.enable('browser client minification');
    app.io.enable('browser client etag');
    app.io.enable('browser client gzip');
    app.io.set('log level', 1);
    app.io.set('transports', [
        'websocket',
        'flashsocket',
        'htmlfile',
        'xhr-polling',
        'jsonp-polling'
    ]);
    app.io.set('log colors', true);
});

/* Socket IO: Import Routes */
require('./socketWeb')(app.io);

/* Listen To Server */
srv.listen(config.webserver.port);


// Create server & socket for slave
var server = http.createServer(function (req, res) {
    // Send HTML headers
    res.writeHead(403);
});
server.listen(config.server.master.port);
io = io.listen(server);

require('./socket').iosocket(io.sockets);
emit = require('./socket').emit;