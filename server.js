var port = 8099;
var token = 'hah123';

var express = require('express');
var crypto = require('crypto');
var path = require('path');
var wechat = require('wechat');
var util = require('./libs/util');
var WechatAPI = require('wechat-api');

var session = require('express-session');

var wechat_file = path.join(__dirname, './config/wechat.txt');

var app = express();

var wechatConfig = {
    token: token,
    appid: 'wx56a612318aacf970',
    appsecret: '65f7a5066f84068addb40e9a1a128632',
    encodingAESKey: 'Sd2C1xR2ncU7y0Ibq1bq75sgrd0tihWS3gkRnUM1aDe',
    checkSignature: false // 可选，默认为true。由于微信公众平台接口调试工具在明文模式下不发送签名，所以如要使用该测试工具，请将其设置为false
};

var menu = {
    "button": [
        {
            "name": "学院信息",
            "sub_button": [
                {
                    "type": "view",
                    "name": "平台微首页",
                    "url": "http://wunan777.ngrok.cc/index"
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
                }
            ]
        },
        {
            "name": "联系我们",
            "sub_button": [
                {
                    "type": "view",
                    "name": "平台微首页",
                    "url": "http://wunan777.ngrok.cc/index"
                }
            ]
        },
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
    if (result.errcode == '0') {
        console.log('weixin menu recreated!');
    }
    else {
        console.log(err);
    }

});


app.use('/weixin', wechat(wechatConfig, function (req, res, next) {

    var message = req.weixin;
    var MsgType = message.MsgType;

    console.log(message);
    if (MsgType === 'event') {
        var Event = message.Event;
        if (Event === 'subscribe') {
            res.reply('欢迎关注学籍管理平台！');
        }
        else if (Event === 'CLICK') {
            var eventKey = message.EventKey;
            var url = 'http://3.iduter.applinzi.com/experiment/physics_login.php?openid=o9OqljswUCVvXjHGWdlMLnzO9Wmw&state=0';
            if (eventKey === 'baseInfo') {
                res.reply({
                    type: 'text',
                    content: '系统检测到你还没有进行平台和微信绑定，请点击'
                        + '<a href="' + url + '">'
                        + '学籍平台'
                        + '</a>进行绑定。'
                });

            }
        }
    }
    else {
        if (message.Content === '1') {
            var filePath = path.join(__dirname, './public/dog.png');
            api.uploadMedia(filePath, 'image', function (err, response) {
                res.reply({
                  type: "image",
                  content: {
                    mediaId: response.media_id
                  }
                });
            });
        }
        else {
            res.reply([
              {
                title: 'test23',
                description: '这只是个测试',
                picUrl: 'http://img4.3lian.com/img2005/05/19/17.jpg',
                url: 'http://nodeapi.cloudfoundry.com/'
              }
            ]);
        }
    }

}));

// 路由
app.set('view engine', 'ejs');
// app.use(session({
//     secret: 'abcss',
//     resave: true,
//     saveUninitialized: false,
//     cookie: {
//         maxAge: 3 * 24 * 60 * 1000, // 时间ms
//     }
// }));

app.use(function (req, res, next) {

    // if (req.session.sign) {
    //     res.send('已登录');
    // }
    // else {
    //     req.session.sign = true;
    //     res.send('hh');
    // }
    next();

});

app.get('/index', function (req, res) {
    route(req, res);
});

app.get('/introduction', function (req, res) {
    route(req, res);
});

app.get('/majorIntroduction', function (req, res) {
    route(req, res);
});

app.get('/collegeDynamics', function (req, res) {
    route(req, res);
});

app.get('/onlineApplication', function (req, res) {
    route(req, res);
});

app.get('/help', function (req, res) {
    route(req, res);
});

app.get('/studyCenter', function (req, res) {
    route(req, res);
});

app.get('/contactUs', function (req, res) {
    route(req, res);
});

app.get('/person/*', function (req, res) {
    route(req, res);
});

// app.get('/person/progress', function (req, res) {
//     route(req, res);
// });


function route(req, res) {

    var pathName = req.url.split('?')[0];
    var search = req.url.split('?')[1] || '';

    var arr = pathName.split('/');
    var routerName = arr.join('');
    if (routerName) {
        res.render('index', {
            title: routerName,
            url: '/fe/js/' + routerName + '.js'
        });
    }
    else {
        res.send('抱歉，未找到该页面！');
    }
}

var server = app.listen(port, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});
