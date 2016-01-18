/*eslint no-magic-numbers: 0*/

'use strict';

var React = require('react');
var Tabs = require('react-bootstrap/lib/Tabs');
var Tab = require('react-bootstrap/lib/Tab');
var HomeworkIntroduction = require('./homework-introduction.component');
var HomeworkTemplate = require('./homework-template.component');
var SubmissionIntroduction = require('./submission-introduction.component');
var RunningResult = require('./running-result.component');


var Homework = React.createClass({
  render() {
    return (
        <div className="col-md-9 col-sm-9 col-xs-12">
          <div className="content">
            <Tabs defaultActiveKey={1} animation={false}>
              <Tab eventKey={1} title="题目说明"><HomeworkIntroduction /></Tab>
              <Tab eventKey={2} title="题目模板"><HomeworkTemplate/></Tab>
              <Tab eventKey={3} title="提交说明"><SubmissionIntroduction /></Tab>
              <Tab eventKey={4} title="运行结果"><RunningResult /></Tab>
            </Tabs>
          </div>
        </div>
    );
  }
});

module.exports = Homework;