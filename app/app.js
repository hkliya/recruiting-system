'use strict';

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var route = require('./routes/route');
var webpack = require('webpack');
var webpackDevMiddleware = require('webpack-dev-middleware');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var sessionCheck = require('./middleware/session-check');
var errRequestHandler = require('./middleware/errorRequestHandler');
var util = require('util');
var mongoose = require('mongoose');
var MongoStore = require('connect-mongo')(session);
var constant = require('./mixin/constant');
var yamlConfig = require('node-yaml-config');
var passport = require('passport');
var GithubStrategy = require('passport-github').Strategy;

var config = yamlConfig.load(__dirname + '/config/config.yml');

var env = ['production', 'test', 'staging'].indexOf(process.env.NODE_ENV) < 0 ? 'development': process.env.NODE_ENV;

mongoose.connect(config.database);

app.use(cookieParser());
app.use(session({
  secret: 'RECRUITING_SYSTEM', resave: false, saveUninitialized: false,
  store: new MongoStore({
    url: config.database,
    ttl: config.sessionTtl
  })
}));

app.use(bodyParser.urlencoded({
  extended: false
}));

app.use(bodyParser.json());

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

if (env === 'development') {
  var compile = webpack(require('./webpack.config'));
  app.use(webpackDevMiddleware(compile, {
    publicPath: '/assets/',   // 以/assets/作为请求的公共目录
    lazy: true,               // 只有请求时才编译
    noInfo: true,             // 只打印警告和错误信息
    stats: {
      colors: true
    }
  }));
}

passport.use(new GithubStrategy({
  clientID: '3d1ce4b21c72eed40be3',
  clientSecret: 'fe406b1fdc3f386871979976e244e01224c933ac',
  callbackURL: 'http://localhost:3000/login/github/callback'
}, function(accessToken, refreshToken, profile, done) {
  done(null, profile);
}));

app.use(sessionCheck);

app.use(express.static('public'));

route.setRoutes(app);

app.all('*', errRequestHandler);

app.listen(config.port,function () {
  console.log('App listening at http://localhost:' + config.port);
});

module.exports = app;