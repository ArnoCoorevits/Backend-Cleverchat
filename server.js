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

require('./models/User')
require('./models/Chatbot')

var indexRouter = require('./routes/index.routes');
var usersRouter = require('./routes/user.routes');
var chatbotsRouter = require('./routes/chatbots.routes');

var app = express();

app.use(logger('dev'));
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/', indexRouter);
app.use('/user', usersRouter);
app.use('/chatbots', chatbotsRouter);

mongoose.connect(
  `mongodb+srv://arnocoorevits:${process.env.MONGO_PASSWORD}@cluster0-0ccgj.mongodb.net/cleverchat`,
  { useCreateIndex: true, useNewUrlParser: true });
var db = mongoose.connection;
db.on('error', console.error.bind(console, '[Mongoose] Connection error:'));
db.once('open', function() {
  console.info('[Mongoose] Connected to database')
});

app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.json({error: err})
});

app.listen(3000, function (req, res, err){
    console.log('app listens at 3000')
})

module.exports = app;