'use strict'

var moment = require('moment');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongodb = require('../wechat/mongodb');
var cryption = require('../wechat/cryption');

var mobileController = require('./mobileController');
var manageController = require('./manageController');

module.exports = function (app) {
    // post 请求需要解析body
    app.use(bodyParser.json()); // for parsing application/json
    app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
    app.use(cookieParser());
    mobileController(app);
    manageController(app);
}
