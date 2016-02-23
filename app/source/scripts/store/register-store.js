'use strict';

var Reflux = require('reflux');
var RegisterActions = require('../actions/register-actions');
var page = require('page');
var validate = require('validate.js');
var request = require('superagent');
var constant = require('../../../mixin/constant');
var constraint = require('../../../mixin/register-constraint');
var async = require('async');

var RegisterStore = Reflux.createStore({
  listenables: RegisterActions,

  onCheckEmail: function (value, done) {
    return request
        .get('/register/validate-email')
        .set('Content-Type', 'application/json')
        .query({
          email: value
        })
        .end((err, req) => {
          var error = '';
          if (req.body.status === constant.httpCode.OK) {
            error = '该邮箱已被注册';
          }
          done({emailError: error});
        });
  },

  onCheckMobilePhone: function (value, done) {
    return request
        .get('/register/validate-mobile-phone')
        .set('Content-Type', 'application/json')
        .query({
          mobilePhone: value
        })
        .end((err, req) => {
          var error = '';
          if (req.body.status === constant.httpCode.OK) {
            error = '该手机号已被注册';
          }
          done({mobilePhoneError: error});
        });
  },

  onRegister: function (mobilePhone, email, password) {
    request.post('/register').set('Content-Type', 'application/json').send({
      mobilePhone: mobilePhone,
      email: email,
      password: password

    }).end((err, req) => {
      var info = req.body;
      if (info.status === constant.httpCode.OK) {
        this.onInitialUserQuiz();
      } else {
        var emailExist = info.data.isEmailExist ? '该邮箱已被注册' : '';
        var mobilePhoneExist = info.data.isMobilePhoneExist ? '该手机号已被注册' : '';

        this.trigger({
          mobilePhoneError: mobilePhoneExist,
          emailError: emailExist,
          clickable: false
        });
      }
    });
  },

  onInitialUserQuiz: function () {
    async.series({
      initializeQuizzes: (done) => {
        request.get('/user-initialization/initializeQuizzes').
            set('Content-Type', 'application/json')
            .end(function (err) {
              if (err) {
                done(err);
              } else {
                done(null, true);
              }
            });
      }
    }, function (err, data) {
      if (data.initializeQuizzes) {
        page('user-center.html');
      } else {
        console.log(err);
      }
    });
  },

  onChangeState: function () {
    this.trigger({
      isShowToggle: false,
      passwordSafeLevel: '',
      passwordSafeStyle: ''
    });
  },

  onInputPassword: function (password) {
    this.trigger({
      password: password
    });
  }
});

module.exports = RegisterStore;