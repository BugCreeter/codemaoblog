var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session')

var flash = require('connect-flash')
var RedisStore = require('connect-redis')(session)

var routes = require('./routes/index');

var app = express();

app.set('port',9999)
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret: 'woot',
    store: new RedisStore({
        host: '127.0.0.1',
        port: 6379
    }),
    resave: false,
    saveUninitialized: false
}))

app.use(flash())

routes(app)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});


// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            data: { msg: req.flash('msg')},
            session: req.session,
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
        data: { msg: req.flash('msg')},
        session: req.session,
        message: err.message,
        error: {}
    });
});

app.listen(app.get('port'), function () {
    console.log('start')
})

module.exports = app;
