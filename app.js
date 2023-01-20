var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session')
var routes = require('./routes/index');
var oauth2server = require('node-oauth2-server');
var authController = require('./controllers/auth.controller');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// Middlewares
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: true
}))


app.oauth = oauth2server({
  model: require('./oAuth2/oauth2ServerModel'), // See below for specification
  grants: ['password', 'refresh_token', 'authorization_code', 'client_credentials'],
  debug: true,
  accessTokenLifetime: 3600, //seconds
  refreshTokenLifetime: 1209600, //seconds
  authCodeLifetime: 30, //seconds
  // clientIdRegex:/^[a-z0-9-_]{3,40}$/i,
  // passthroughErrors: false,
  // continueAfterResponse: false,
});
// Handle token grant requests
app.all('/oauth/token', app.oauth.grant());

// Show them the "do you authorise xyz app to access your content?" page
app.get('/oauth/authorise', authController.oauth2authorizePage);

// Handle authorise
app.post('/oauth/authorise', authController.oauth2authorizeCheck, app.oauth.authCodeGrant(authController.oauth2authorize));

// Handle oauth2 login
app.get('/login', authController.oauth2loginForm);
app.post('/login', authController.oauth2login);

app.get('/secret', app.oauth.authorise(), function (req, res) {
  // Will require a valid access_token
  res.send('Secret area');
});

// Routes
app.use('/', routes);


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
