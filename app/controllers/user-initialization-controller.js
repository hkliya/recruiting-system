'use strict';

var apiRequest = require('../services/api-request');
var logicPuzzle = require('../models/logic-puzzle');
var homeworkQuizzes = require('../models/homework-quizzes');
var userHomeworkQuizzes = require('../models/user-homework-quizzes');
var constant = require('../mixin/constant');
var async = require('async');

function UserInitializationController() {
}

UserInitializationController.prototype.initialLogicPuzzle = function (req, res) {
  var userId = req.session.user.id;
  var quizItems, quizExamples, blankQuizId, paperId;
  var logicPuzzleUrl = 'papers/enrollment';

  async.waterfall([

    (done)=> {

      logicPuzzle.findOne({userId: userId}, (err, data) => {
        if (err) {
          done(err, data);
        } else {
          done(!!data, data);
        }
      });
    }, (data, done)=> {

      apiRequest.get(logicPuzzleUrl, done);

    }, (responds, done)=> {

      var quizzes = responds.body.sections[0].quizzes[0];
      blankQuizId = quizzes.id;
      paperId = responds.body.id;
      var itemsUri = quizzes.items_uri;

      done(null, itemsUri);

    }, (itemsUri, done) => {

      apiRequest.get(itemsUri, done);

    }, (responds, done) => {

      quizItems = responds.body.quizItems;
      quizExamples = responds.body.exampleItems;

      var isNotExist = true;

      done(null, isNotExist);
    }, (isNotExist, done) => {

      logicPuzzle.create({
        userId: userId,
        quizItems: quizItems,
        quizExamples: quizExamples,
        blankQuizId: blankQuizId,
        paperId: paperId
      }, done);

    }
  ], (err) => {
    if (true !== err && err) {
      res.statusCode(constant.httpCode.INTERNAL_SERVER_ERROR);
      res.send({status: constant.httpCode.INTERNAL_SERVER_ERROR, message: '服务器错误'});
    } else {
      res.send({status: constant.httpCode.OK, message: '初始化成功!'});
    }
  });
};

UserInitializationController.prototype.initialHomeworkQuizzes = (req, res) => {
  async.waterfall([
    (done) => {
      apiRequest.get('papers/enrollment', done);
    },

    (response, done) => {
      if (!!response.body.sections) {
        var result;
        response.body.sections.forEach((element, i) => {
          result = element.desc === 'homeworkQuizzes' ? element.quizzes : result;
        });
        apiRequest.get(result[0].items.uri, done);
      } else {
        done(new Error(''));
      }
    },

    (result, done) => {
      homeworkQuizzes.upsertData(result.body.homeworkQuizItems, done);
    },

    (result, done) => {
      homeworkQuizzes.getList(done);
    },

    (result, done) => {
      var userId = req.session.user.id;
      userHomeworkQuizzes.initUserHomeworkQuizzes(userId, result, done);
    }
  ], (err, data) => {
    if (err) {
      res.status(constant.httpCode.INTERNAL_SERVER_ERROR);
      res.send({status: constant.httpCode.INTERNAL_SERVER_ERROR, message: err.message});
    } else {
      res.send({status: constant.httpCode.OK});
    }
  });
};

module.exports = UserInitializationController;