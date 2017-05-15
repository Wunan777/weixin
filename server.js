var port = 8099;

var path = require('path');
var express = require('express');
var session = require('express-session');
var crypto = require('crypto');
var wechat = require('wechat');
var WechatAPI = require('wechat-api');


var util = require('./libs/util');
var route = require('./routes/index');

var app = express();
var wechatConfig = require('./config/wechat').config;
var onlineAddress = require('./config/ipConfig').config.online;

var menu = {
    "button": [
        {
            "name": "学院信息",
            "sub_button": [
                {
                    "type": "view",
                    "name": "平台微首页",
                    "url": onlineAddress + "/index"
                }
            ]
        },
        {
            "name": "个人信息",
            "sub_button": [
                {
                    "type": "click",
                    "name": "基本信息",
                    "key": "baseInfo"
                },
                {
                    "type": "click",
                    "name": "我的成绩",
                    "key": "myScore"
                },
                {
                    "type": "click",
                    "name": "我的考场",
                    "key": "myRoom"
                },
                {
                    "type": "click",
                    "name": "我的学习进度",
                    "key": "myCredit"
                }
            ]
        },
        {
            "type": "view",
            "name": "联系我们",
            "url": onlineAddress + "/contactUs"
        }
    ]
};

app.use('/fe', express.static('fe'));
app.use('/public', express.static('public'));
app.use(express.query());


// 微信
// 菜单更新
var api = new WechatAPI(wechatConfig.appid, wechatConfig.appsecret);

api.removeMenu(function () {
});

api.createMenu(menu, function (err, result) {
    if (result && result.errcode == '0') {
        console.log('weixin menu recreated!');
    }
    else {
        console.log(err);
    }

});


app.use('/weixin', wechat(wechatConfig, require('./wechat/wechat')));

// 路由
route(app);
app.set('view engine', 'ejs');

var server = app.listen(port, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});
