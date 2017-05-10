'use strict'

// 微信-中间件 ，处理微信界面用户的操作逻辑。
var path = require('path');
var WechatAPI = require('wechat-api');
var wechatConfig = require('../config/wechat').config;
var cryption = require('./cryption');
var mongodb = require('./mongodb');

module.exports = function (req, res, next) {

    var message = req.weixin;
    var MsgType = message.MsgType;
    var api = new WechatAPI(wechatConfig.appid, wechatConfig.appsecret);

    console.log(message);

    if (MsgType === 'event') {
        var Event = message.Event;
        if (Event === 'subscribe') {
            res.reply('欢迎关注学籍管理平台！');
        }
        else if (Event === 'CLICK') {
            var eventKey = message.EventKey;

            if (eventKey === 'baseInfo'
                || eventKey === 'myScore'
                || eventKey === 'myRoom'
                || eventKey === 'myProgress'
            ) {

                // 检测是否账号是否绑定了微信号

                var openid = message.FromUserName;
                mongodb.find(
                    'WeixinBindList',
                    {
                        'open_id': openid
                    },
                    function (response) {
                        console.log('这是openid 查询结果');
                        console.log(response);

                        if (response.err == '0') {
                            if (response.data.length > 0) {

                                // 已绑定
                                // 根据openid 查询
                                var studentId = response.data[0].student_id + '';

                                mongodb.find(
                                    'User',
                                    {
                                        'student_id': studentId
                                    },
                                    function (stuRes) {
                                        console.log('这是stuRes 查询结果');
                                        console.log('这是studentid ' +  studentId);
                                        console.log(stuRes);

                                        if (stuRes.err == '0') {
                                            if (stuRes.data.length > 0) {

                                                var studentInfo = stuRes.data[0];
                                                var encryptOpenid = cryption.enCryption(openid);
                                                var cancelUrl = 'http://wunan777.ngrok.cc/weixinBindUpdate?openId=' + encryptOpenid;

                                                var content = "平台信息"
                                                    + "\n"
                                                    + "姓名：" + studentInfo.name
                                                    + "\n"
                                                    + "专业：" + studentInfo.major
                                                    + "\n"
                                                    + "所在学习中心：" + studentInfo.center
                                                    + "\n"
                                                    + "大工学号：" + studentInfo.student_id
                                                    + '\n'
                                                    + "学籍状态：" + studentInfo.status
                                                    + '\n'
                                                    + "---------------"
                                                    + "\n"
                                                    + "系统检测到您已经绑定过，<a href='" + cancelUrl
                                                    + "'>点击此处</a>取消或更改绑定信息";

                                                res.reply({
                                                    type: 'text',
                                                    content: content
                                                });

                                            }
                                            else {
                                                res.reply({
                                                    type: 'text',
                                                    content: '数据库中无绑定学生信息。'
                                                });
                                            }
                                        }
                                        else {
                                            res.reply({
                                                type: 'text',
                                                content: '查询过程中出错，请稍后重试。'
                                            });
                                        }
                                    }
                                );
                            }
                            else {
                                // 未绑定，要跳转绑定页面

                                // 对openid加密
                                var encryptOpenid = cryption.enCryption(openid);
                                var url = 'http://wunan777.ngrok.cc/weixinbind?openId=' + encryptOpenid;

                                res.reply({
                                    type: 'text',
                                    content: '系统检测到你还没有进行平台和微信绑定，请点击'
                                        + '<a href="' + url + '">'
                                        + '学籍平台'
                                        + '</a>进行绑定。'
                                });

                            }
                        }
                        else {
                            res.reply({
                                type: 'text',
                                content: '系统繁忙，请稍后重试。'
                            });
                        }
                    }
                );

            }


        }
    }
    else {
        if (message.Content === '1') {
            var filePath = path.join(__dirname, '../public/dog.png');
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

}