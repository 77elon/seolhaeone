var createError = require('http-errors');
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var adminRouter = require('./routes/admin');

var app = express();

var favicon = require('serve-favicon');

app.use(favicon(__dirname + '/public/images/favicon.ico'));
app.locals.moment = require('moment');

var session = require('express-session');          
var MySQLStore = require('express-mysql-session')(session);  
var options ={
    host: '10.0.1.193',
    port: 3306,
    user: 'root',
    password: 'VegaIron2!',
    database: 'session'
};
var sessionStore = new MySQLStore(options);   

const hour = 3600000;
app.use(session({                               
  key: "seolhaeone",
  secret: "e0cac8a6b18e1f6b3e082c7aef2da6ce6bef674db00893223f5640a158d676a36153fc269c0aee6399d623bdf4ba9356",
  resave: true,
  saveUninitialized: false,
  store: sessionStore,
  cookie:{ expires : new Date(Date.now() + 1/2*hour)}                            
}))

//parse requests
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/css/bootstrap', express.static(__dirname + '/node_modules/bootstrap/dist/css'));
app.use('/js/bootstrap', express.static(__dirname + '/node_modules/bootstrap/dist/js'));

app.use('/js/video.js', express.static(__dirname + '/node_modules/video.js/dist'));

app.use('/', indexRouter);
app.use('/admin', adminRouter);

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
