'use strict'

var wechat = require('wechat');
var WechatAPI = require('wechat-api');

var wechatConfig = require('../config/wechat').config;
var onlineAddress = require('../config/ipConfig').config.online;

module.exports = function (app) {

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

    // 菜单更新
    var api = new WechatAPI(wechatConfig.appid, wechatConfig.appsecret);

    api.removeMenu(function () {

        console.log('weixin menu deleted!');

        api.createMenu(menu, function (err, result) {
            if (result && result.errcode == '0') {
                console.log('weixin menu recreated!');
            }
            else {
                console.log(err);
            }

        });

    });


    // 首先启动程序的时候， 微信服务器 和 本地服务器 要做一个认证
    // 微信服务器会向本地服务器发送一个 get '/weixin' 请求，
    // get 请求带有4个参数，
    // signature , timestamp , nonce , ehcostr
    // 这时本地服务器要进行验证
    // 加密/校验流程如下：
    // 1. 将token、timestamp、nonce三个参数进行字典序排序
    // 2. 将三个参数字符串拼接成一个字符串进行sha1加密
    // 3. 开发者获得加密后的字符串可与signature对比，标识该请求来源于微信
    // 验证成功后
    // 返回echostr

    app.use('/weixin', wechat(wechatConfig, require('./wechat')));

}