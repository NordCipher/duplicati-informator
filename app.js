var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose')

// Database
var mongo = require('mongodb');
var monk = require('monk');
var db = monk('localhost:27017/nodetest2');

mongoose.connect('mongodb://localhost:27017/nodetest2',{useNewUrlParser: true, useUnifiedTopology: true});

// var mainRoutes = require('./routes/main');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();
// Make our db accessible to our router
app.use(function(req,res,next){
  req.db = db;
  next();
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// Super Duper PUT stuff
app.put('/updateinfo/:id',usersRouter.updateinfo(db));

app.use('/', indexRouter);
app.use('/users', usersRouter);


// app.use(mainRoutes);


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
