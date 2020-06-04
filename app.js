var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var signatureRouter = require('./routes/get_signature');
var frofroRouter = require('./routes/get_frofro');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));
// const path = require('path')// Serve static files from the React frontend app
app.use(express.static(path.join(__dirname, './froala-fun/build')))// Anything that doesn't match the above, send back index.html
app.get('*', function(req, res) {
  res.sendFile('index.html', { root: __dirname }, function(err) {
    if (err) {
      res.status(500).send(err);
    }
  });
});

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/get_signature', signatureRouter);
app.use('/get_frofro', frofroRouter);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
