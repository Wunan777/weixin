'use strict'

module.exports = function (app) {
    // pc端 后台管理页面

    app.get('/manage/*', function (req, res) {
        var pathName = req.url.split('?')[0];


        if (pathName === '/manage/') {
            pathName = '/manage/statistic'
        }
        else if (pathName === '/manage/logout') {
            req.session.manageSign = false;
        }

        if (!!req.session.manageSign) {

            var userName = req.session.manageAccount;
            res.render('manage', {
                title: '微信公众号后台系统',
                url: '/fe/js' + pathName + '.js',
                pathName: pathName,
                userName: userName
            });
        }
        else {
            res.render('manageLogin', {
                title: '微信公众号后台系统登录页',
                url: '/fe/js/manage/login.js',
                pathName: pathName
            });
        }


    });
}

