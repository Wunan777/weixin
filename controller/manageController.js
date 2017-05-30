'use strict'

var mongodb = require('../wechat/mongodb');

module.exports = function (app) {
    app.post('/manage/getAggregation', function (req, res) {
        mongodb
        .find(
            'Aggregation',
            {},
            function (response) {
                if (response.err == '0') {
                    res.send({
                        err: 0,
                        msg: '查询成功',
                        data: response.data
                    });
                }
                else {
                    res.send({
                        err: 1,
                        msg: err.msg
                    });
                }
            }
        )
    });

    app.post('/manage/getAnnual', function (req, res) {
        mongodb
        .find(
            'Annual',
            {},
            function (response) {
                if (response.err == '0') {
                    res.send({
                        err: 0,
                        msg: '查询成功',
                        data: response.data
                    });
                }
                else {
                    res.send({
                        err: 1,
                        msg: err.msg
                    });
                }
            }
        )
    });

    app.post('/manage/getPv', function (req, res) {
        var body = req.body;
        var arr = body.query;
        var query = [];

        for (var i = 0, len = arr.length; i < len; i++) {
            query.push({
                'date': arr[i]
            });
        }

        mongodb.find(
            'Pv',
            {
                $or: query
            },
            function (response) {
                if (response.err == '0') {
                    var data = response.data;
                    var temp = {};

                    for (var i = 0, len = data.length; i < len; i++) {
                         var key = data[i]['date'];
                         if (!temp[key]) {
                            temp[key] = 1;
                         }
                         else {
                            temp[key]++;
                         }
                    }

                    res.send({
                        err: 0,
                        msg: '查询成功',
                        data: temp,
                        n: data.length
                    });
                }
                else {
                    res.send({
                        err: 1,
                        msg: err.msg
                    });
                }
            }
        );
    });

    app.post('/manage/getUv', function (req, res) {
        var body = req.body;
        var arr = body.query;
        var query = [];

        for (var i = 0, len = arr.length; i < len; i++) {
            query.push({
                'date': arr[i]
            });
        }

        mongodb.find(
            'Uv',
            {
                $or: query
            },
            function (response) {
                if (response.err == '0') {
                    var data = response.data;
                    var temp = {};

                    for (var i = 0, len = data.length; i < len; i++) {
                         var key = data[i]['date'];
                         temp[key] = data[i]['n'];
                    }

                    res.send({
                        err: 0,
                        msg: '查询成功',
                        data: temp,
                        n: data.length
                    });
                }
                else {
                    res.send({
                        err: 1,
                        msg: err.msg
                    });
                }
            }
        );

    });

    app.post('/manage/login', function (req, loginRes) {

        var body = req.body;
        var account = body.account;
        var password = body.password;

        mongodb
        .find(
            'Manager',
            {
                'account': account,
                'password': password
            },
            function (res) {
                if (res.err == '0') {

                    if (res.data.length > 0) {
                        var studentInfo = res.data[0];
                        req.session.manageSign = true;
                        req.session.manageAccount = account;
                        req.session.managePassword = password;

                        loginRes.send({
                            err: 0,
                            msg: '登录成功！'
                        });
                    }
                    else {
                        loginRes.send({
                            err: 1,
                            msg: '账号或密码不正确！'
                        });
                    }

                }
                else {
                    loginRes.send({
                        err: 2,
                        msg: '数据库查询过程中出错！'
                    });
                }

            }
        );

    });
}
