var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var ejs = require('ejs');
var cors = require('cors');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var eventsRouter = require('./routes/events');

var app = express();

// view engine setup
// app.engine('html', ejs.__express);
// app.set('view engine', 'html');
// app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'jade');
const corsOptions = {
  origin: ['http://localhost:8080','http://127.0.0.1:8080'],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie', 'Content-Length', 'Accept-Encoding', 'X-CSRF-Token', 'accept', 'origin', 'Cache-Control', 'X-Requested-With'],
  credentials: true
};
app.use(cors(corsOptions));
app.use(logger('dev'));
app.use(express.json({limit: '10mb'}));
app.use(express.urlencoded({limit: '10mb', extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/events', eventsRouter);

// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   if (!req.user) return next(createError(401, 'Please Login to view this data'))
//   next();
// });

// error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });

module.exports = app;
