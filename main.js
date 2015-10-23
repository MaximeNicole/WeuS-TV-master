// Load requirements
var
    express = require('express'),
    app = express(),
    http = require('http'),
    slashes = require("connect-slashes"),
    ejs = require('ejs'),
    path = require('path');

/* IMPORTANT - No VAR Makes Variables Global */
config = require('./config');


//Express
app.engine('htmlejs', ejs.renderFile);
app.set('views', path.join(__dirname, 'views/'));
app.set('view engine', 'ejs');
app.set('x-powered-by', false);
app.use(express.static(path.join(__dirname, 'public')));
app.use('/img', express.static(path.join(__dirname, 'public/img')));
app.use(slashes(true));
//app.use(express.logger('dev'));
//app.use(express.compress());
//app.use(express.bodyParser());
//app.use(express.methodOverride());
//app.use(express.cookieParser(config.cookie_session.secret));
//app.use(express.cookieSession({key: config.cookie_session.key}));

/* Development Only
 app.configure('development', function () {

 });

 /* Production Only
 app.configure('production', function () {
 process.on('uncaughtException', function (error) {
 console.log("Uncaught Error: " + error.stack);
 return false;
 });
 }); */

/* Express: Start Router */
//app.use(app.router);

/* Express: Import Routes */
require('./routes/routes')(app);

/* Socket IO: Configuration
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
//require('./socketWeb')(app.io);

/* Listen To Server */
var server = http.createServer(app).listen(config.webserver.port);
var io = require('socket.io').listen(server);

require('./sockets/socketSlave').sockets(io);
require('./sockets/socketWeb')(io);