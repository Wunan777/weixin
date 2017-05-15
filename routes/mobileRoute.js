'use strict'
var moment = require('moment');
var mongodb = require('../wechat/mongodb');
var cookieParser = require('cookie-parser');

module.exports = function (app) {
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


}

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