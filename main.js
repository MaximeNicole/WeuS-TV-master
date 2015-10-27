// PM2
require('pmx').init({
    http: true
});

// Load requirements
var
    express = require('express'),
    app = express(),
    http = require('http'),
    slashes = require("connect-slashes"),
    ejs = require('ejs'),
    path = require('path'),
    monk = require('monk');

/* IMPORTANT - No VAR Makes Variables Global */
config = require('./config');
db = monk('localhost:27017/weustvmaster');

//Express
app.engine('htmlejs', ejs.renderFile);
app.set('views', path.join(__dirname, 'views/'));
app.set('view engine', 'ejs');
app.set('x-powered-by', false);
app.use(express.static(path.join(__dirname, 'public')));
app.use(slashes(true));
//app.use(express.compress());
//app.use(express.bodyParser());


app.use(function (req, res, next) {
    req.db = db;
    next();
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

/* Express: Import Routes */
require('./routes/routes')(app);

/* Listen To Server */
var server = http.createServer(app).listen(config.server.master.port);
var io = require('socket.io').listen(server);

/* Listen Sockets */
require('./sockets/socketSlave').sockets(io);
require('./sockets/socketWeb')(io);