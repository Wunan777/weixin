'use strict'

var mongodb = require('../wechat/mongodb');
var cryption = require('../wechat/cryption');

module.exports = function (app) {

    // 获取省信息
    app.post('/studyCenter/province', function (req, res) {
        mongodb.find(
            'Province',
            {},
            function (provinceRes) {
                if (provinceRes.err == '0') {
                    res.send({
                        data: provinceRes.data,
                        err: 0,
                        msg: 'ok'
                    });
                }
                else {
                    res.send({
                        err: 1,
                        msg: '数据库查询过程中出错！'
                    });
                }
            }
        );
    });

    app.post('/studyCenter/learnCenter', function (req, res) {
        mongodb
        .find(
            'Region',
            {
                'City_ID': req.body.cityId
            },
            function (learnCenterRes) {
                if (learnCenterRes.err == '0') {
                    res.send({
                        data: learnCenterRes.data,
                        err: 0,
                        msg: 'ok'
                    });
                }
                else {
                    res.send({
                        err: 1,
                        msg: '数据库查询过程中出错！'
                    });
                }
            }
        );
    });

    app.post('/studyCenter/subject', function (req, res) {
        mongodb
        .find(
            'Subject',
            {},
            function (subjectRes) {
                if (subjectRes.err == '0') {
                    res.send({
                        data: subjectRes.data,
                        err: 0,
                        msg: 'ok'
                    });
                }
                else {
                    res.send({
                        err: 1,
                        msg: '数据库查询过程中出错！'
                    });
                }
            }
        );
    });

    // 绑定微信号
    app.post('/weixinBind', function (req, weixinRes) {

        var body = req.body;
        var account = body.account;
        var password = body.password;
        // openId解密
        var openId = cryption.deCryption(body.openId);

        // 因为绑定界面，可以通过url到达，防止重复绑定
        // 这里应该再次判断，是否已绑定了
        mongodb.find(
            'WeixinBindList',
            {
                'open_id': openId
            },
            function (searchOpenIdRes) {

                if (searchOpenIdRes.err == '0') {

                    if (searchOpenIdRes.data.length > 0) {
                        weixinRes.send({
                            err: 4,
                            msg: '该微信号已绑定，请勿重复绑定！'
                        });
                    }
                    else {
                        // 检查是否存在该用户
                        // 给前端返回的四个状体码
                        // 0 微信号绑定成功
                        // 1 数据库插入过程中出错
                        // 2 数据库查询过程中出错
                        // 3 账号或密码不正确
                        mongodb.find(
                            'User',
                            {
                                'account': account,
                                'password': password
                            },
                            function (res) {
                                if (res.err == '0') {

                                    if (res.data.length > 0) {
                                        var item = res.data[0];

                                        mongodb.insert(
                                            'WeixinBindList',
                                            [
                                                {
                                                    account: account,
                                                    password: password,
                                                    open_id: openId,
                                                    student_id: item.student_id,
                                                    expire_time: '9000000000'
                                                }
                                            ],
                                            function (response) {
                                                if (response.err == '0') {
                                                    weixinRes.send({
                                                        err: 0,
                                                        msg: '微信号绑定成功，请返回到公众号主页重新查询！'
                                                    });
                                                }
                                                else {
                                                    weixinRes.send({
                                                        err: 1,
                                                        msg: '数据库插入过程中出错！',
                                                        errorDetail: response.msg
                                                    });
                                                }
                                            }
                                        );
                                    }
                                    else {
                                        weixinRes.send({
                                            err: 3,
                                            msg: '账号或密码不正确！'
                                        });
                                    }

                                }
                                else {
                                    weixinRes.send({
                                        err: 2,
                                        msg: '数据库查询过程中出错！'
                                    });
                                }

                            }
                        );
                    }

                }
                else {
                    weixinRes.send({
                        err: 2,
                        msg: '数据库查询过程中出错！'
                    });
                }
            }
        );

    });

    // 修改绑定的微信号
    app.post('/weixinBindUpdate', function (req, weixinRes) {

        var body = req.body;
        var account = body.account;
        var password = body.password;
        // openId解密
        var openId = cryption.deCryption(body.openId);

        // 检查重新提交的账号密码是否正确
        mongodb.find(
            'User',
            {
                'account': account,
                'password': password
            },
            function (res) {
                if (res.err == '0') {

                    if (res.data.length > 0) {
                        var item = res.data[0];

                        mongodb
                        .update(
                            'WeixinBindList',
                            {
                                open_id: openId
                            },
                            {
                                $set: {
                                    account: account,
                                    password: password,
                                    student_id: item.student_id
                                }
                            },
                            function (response) {
                                console.log(response);
                                if (response.err == '0') {
                                    // WeixinListBind 表中有对应openid的才能修改，
                                    // 否则 表中没有openid的，默认不插入，所以nModified为0。

                                    weixinRes.send({
                                        err: 0,
                                        msg: '微信号重新绑定，请返回到公众号主页重新查询！',
                                        data: response
                                    });

                                }
                                else {
                                    weixinRes.send({
                                        err: 1,
                                        msg: '数据库插入过程中出错！',
                                        errorDetail: response.msg
                                    });
                                }
                            }
                        );
                    }
                    else {
                        weixinRes.send({
                            err: 3,
                            msg: '账号或密码不正确！'
                        });
                    }

                }
                else {
                    weixinRes.send({
                        err: 2,
                        msg: '数据库查询过程中出错！'
                    });
                }

            }
        );

    });

}
