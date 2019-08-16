require('dotenv').config();

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var passport = require('passport');
var bodyParser = require('body-parser');
var cors = require('cors')

//Load mongoose models
require('./models/User')
require('./models/Chatbot')

//Load express routers
var indexRouter = require('./routes/index.routes');
var usersRouter = require('./routes/user.routes');
var chatbotsRouter = require('./routes/chatbots.routes');

var app = express();

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');

//Load libraries
app.use(logger('dev'));
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Express router setup
app.use('/', indexRouter);
app.use('/user', usersRouter);
app.use('/chatbots', chatbotsRouter);

//Mongoose setup
mongoose.connect(
  'mongodb://localhost:27017/PizzaDB',
  { useCreateIndex: true, useNewUrlParser: true });
var db = mongoose.connection;
db.on('error', console.error.bind(console, '[Mongoose] Connection error:'));
db.once('open', function() {
  console.info('[Mongoose] Connected to database')
});

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
  res.json({error: err})
});

app.listen(3000, function (req, res, err){
    console.log('app listens at 3000')
})

module.exports = app;