'use strict'

var moment = require('moment');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongodb = require('../wechat/mongodb');
var cryption = require('../wechat/cryption');

module.exports = function (app) {
    app.set('view engine', 'ejs');
    // post 请求需要解析body
    app.use(bodyParser.json()); // for parsing application/json
    app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
    app.use(cookieParser());

    app.get('/', function (req, res) {
        mobileRoute(req, res);
    });

    app.get('/index', function (req, res) {
        mobileRoute(req, res);
    });

    app.get('/introduction', function (req, res) {
        mobileRoute(req, res);
    });

    app.get('/majorIntroduction', function (req, res) {
        mobileRoute(req, res);
    });

    app.get('/collegeDynamics', function (req, res) {
        mobileRoute(req, res);
    });

    app.get('/onlineApplication', function (req, res) {
        mobileRoute(req, res);
    });

    app.get('/help', function (req, res) {
        mobileRoute(req, res);
    });

    app.get('/studyCenter', function (req, res) {
        mobileRoute(req, res);
    });

    app.get('/contactUs', function (req, res) {
        mobileRoute(req, res);
    });

    app.get('/person/*', function (req, res) {
        mobileRoute(req, res);
    });

    // 增加绑定信息
    app.get('/weixinBind', function (req, res) {

        var pathName = req.url.split('?')[0];
        var arr = pathName.split('/');
        var routerName = arr.join('');
        // 未绑定
        res.render('weixinBind', {
            title: '绑定微信号',
            url: '/fe/js/' + routerName + '.js'
        });

    });

    // 更新绑定信息
    app.get('/weixinBindUpdate', function (req, res) {

        var pathName = req.url.split('?')[0];
        var arr = pathName.split('/');
        var routerName = arr.join('');

        // 未绑定
        res.render('weixinBindUpdate', {
            title: '更改微信号绑定信息',
            url: '/fe/js/' + routerName + '.js'
        });

    });

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


    // pc端 后台管理页面
    // 更新绑定信息
    app.get('/manage/*', function (req, res) {
        var pathName = req.url.split('?')[0];
        // var arr = pathName.split('/');
        // var routerName = arr.join('');
        if (pathName === '/manage/') {
            pathName = '/manage/statistic'
        }

        // 未绑定
        res.render('manage', {
            title: '微信公众号后台系统',
            url: '/fe/js' + pathName + '.js'
        });
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
    })

    function mobileRoute(req, res) {

        var pathName = req.url.split('?')[0];
        if (pathName === '/') {
            pathName = '/index';
        }

        pv(pathName);
        uv(req, res);

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

    function uv(req, res) {
        // 当前时间 到 今日23:59:59剩余时间
        var curDate = moment().format('YYYY-MM-DD');
        var todayRestTime = (parseInt(moment(curDate).format('X')) + 24 * 3600 - 1)
            - moment().format('X');

        if (!req.cookies.viewed) {
            res.cookie('viewed', '1', {maxAge: todayRestTime});

            mongodb
            .find(
                'Uv',
                {'date': curDate},
                function (res) {
                    if (res.err == '0') {

                        if (res.data.length > 0) {
                            var n = res.data[0].n + 1;
                            mongodb
                            .update(
                                'Uv',
                                {
                                    'date': curDate
                                },
                                {
                                    $set: {
                                        'n': n
                                    }
                                },
                                function (res) {
                                    if (res.err == '0') {
                                        console.log('用户访问');
                                    }
                                    else {
                                        console.log('更新用户访问表出错' + err.msg);
                                    }
                                }
                            );
                        }
                        else {
                            mongodb
                            .insert(
                                'Uv',
                                [
                                    {
                                        'date': curDate,
                                        'n': 1
                                    }
                                ],
                                function (res) {
                                    if (res.err == '0') {
                                        console.log('用户访问');
                                    }
                                    else {
                                        console.log('更新用户访问表出错' + res.msg);
                                    }
                                }
                            )
                        }

                    }
                    else {
                        console.log(res.msg + ',Uv表查找失败!');
                    }
                }
            );

        }
    }
    function pv(pathName) {

        var curDate = moment().format('YYYY-MM-DD');
        var timeStamp = moment().format('X');
        mongodb
        .insert(
            'Pv',
            [
                {
                    date: curDate,
                    page: pathName,
                    time: timeStamp
                }
            ],
            function (res) {
                if (res.err == '0') {
                    console.log(pathName + ' ' + curDate + '被访问了一次');
                }
                else {
                    console.log(res.msg + ',pv表插入失败!');
                }
            }
        );

    }

}
