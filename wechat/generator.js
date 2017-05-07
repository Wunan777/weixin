'use strict'

var crypto = require('crypto');
var Promise = require('bluebird');
var request = require('request');
var getRawBody = require('raw-body');

var prefix = 'https://api.weixin.qq.com/cgi-bin/';
var api = {
    accessToken: prefix + 'token?grant_type=client_credential'
};

function check(opts) {
    var wechat = opts.wechat;

    var appId = wechat.appId;
    var appSecret = wechat.appSecret;
    var getAccessToken = wechat.getAccessToken();
    var saveAccessToken = wechat.saveAccessToken;

    getAccessToken
    .then(function (data) {
        try {
            data = JSON.parse(data);
        }
        catch(e) {
            return updateAccessToken(appId, appSecret);
        }

        if (isValidAccessToken(data)) {
            Promise.resolve(data);
        }
        else {
            return updateAccessToken(appId, appSecret);
        }
    })
    .then(function (data) {
        saveAccessToken(data);
    });
}

function isValidAccessToken(data) {
    if (!data || !data.access_token) {
        return false;
    }
    var access_token = data.access_token;
    var expires_in = data.expires_in;
    var now = (new Date().getTime());

    if (now < expires_in) {
        return true;
    }
    else {
        return false;
    }
}

function updateAccessToken(appId, appSecret) {

    var url = api.accessToken
        + '&appid='
        + appId
        + '&secret='
        + appSecret;

    return new Promise(function (resolve, reject) {

        request.get(url, function (e, r, body) {

            // console.log(body);
            var data = JSON.parse(body);

            var now = (new Date()).getTime();
            var expires_in = now + (data.expires_in - 20) * 1000;

            data.expires_in = expires_in;
            resolve(data);
        });

    });
}

module.exports = function (opts) {
    // 验证票据信息
    check(opts);

    // 是否为开发者
    var req = opts.req;
    var res = opts.res;
    var token = opts.wechat.token;

    var method = req.method;
    var signature = req.query.signature;
    var timestamp = req.query.timestamp;
    var nonce = req.query.nonce;
    var echostr = req.query.echostr;

    /*  加密/校验流程如下： */
    //1. 将token、timestamp、nonce三个参数进行字典序排序
    var array = new Array(token, timestamp, nonce);
    array.sort();
    var str = array.toString().replace(/,/g, "");

    //2. 将三个参数字符串拼接成一个字符串进行sha1加密
    var sha1Code = crypto.createHash("sha1");
    var code = sha1Code.update(str,'utf-8').digest("hex");

    if (method === 'GET') {
        //3. 开发者获得加密后的字符串可与signature对比，标识该请求来源于微信
        if (code === signature) {
            res.send(echostr)
        }
        else {
            res.send("wrong!!");
        }
    }
    else {
        // 用户的请求
        if (code !== signature) {
            res.send('wrong');
            return false;
        }
        // var data = yield getRawBody(req, {
        //     length:
        // })
    }

}