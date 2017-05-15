var port = 8099;

var path = require('path');
var express = require('express');
var session = require('express-session');
var crypto = require('crypto');

var weixinInit = require('./wechat/init');
var route = require('./routes/index');
var controller = require('./controller/index');

var app = express();

app.use('/fe', express.static('fe'));
app.use('/public', express.static('public'));
app.use(express.query());

// 微信
weixinInit(app);
// 路由
route(app);
// 控制器
controller(app);


var server = app.listen(port, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});