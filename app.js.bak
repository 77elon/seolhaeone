var express = require('express');
var app = express();
var debug = require('debug')('seolhaeone:server');
var http = require('http');

var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);


var server = http.createServer(app);


server.listen(port);
server.on('error', onError);
server.on('listening', onListening);


function normalizePort(val) {
  var port = parseInt(val, 10);
  
  if (isNaN(port)) {
    // named pipe
    return val;
  }
  
  if (port >= 0) {
    // port number
    return port;
  }
  
  return false;
}

/**
* Event listener for HTTP server "error" event.
*/

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }
  
  var bind = typeof port === 'string'
  ? 'Pipe ' + port
  : 'Port ' + port;
  
  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
    console.error(bind + ' requires elevated privileges');
    process.exit(1);
    break;
    case 'EADDRINUSE':
    console.error(bind + ' is already in use');
    process.exit(1);
    break;
    default:
    throw error;
  }
}


function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
  ? 'pipe ' + addr
  : 'port ' + addr.port;
  debug('Listening on ' + bind);
}




var createError = require('http-errors');
var path = require('path');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var adminRouter = require('./routes/admin');


var favicon = require('serve-favicon');

app.use(favicon(__dirname + '/public/images/favicon.ico'));
app.locals.moment = require('moment');

var session = require('./database/session/session');

app.use(session);


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
app.use('/js/video.js-playlist', express.static(__dirname + '/node_modules/videojs-playlist/dist'));


app.use('/js/jquery', express.static(__dirname + '/node_modules/jquery/dist'));
app.use('/js/popperjs', express.static(__dirname + '/node_modules/@popperjs/core/dist/cjs'));


app.use('/css/tui-grid', express.static(__dirname + '/node_modules/tui-grid/dist'));
app.use('/js/tui-grid', express.static(__dirname + '/node_modules/tui-grid/dist'));
app.use('/js/tui-code-snippet', express.static(__dirname + '/node_modules/tui-code-snippet/dist'));

app.use('/', indexRouter);
app.use('/admin', adminRouter);

app.all('/admin/api/*', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
  // allow preflight
  if (req.method === 'OPTIONS') {
    res.send(200);
  } else {
    next();
  }
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
  res.render('error');
});

module.exports = app;