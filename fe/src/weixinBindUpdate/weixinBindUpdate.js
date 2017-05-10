import css from './weixinBindUpdate.css';
import html from './weixinBindUpdate.html';

var app = new Vue({
    el: '#app',
    data: {
        account: '',
        password: '',
        openId: '',
        resErr: -1,
        tip: '',
        submiting: false
    },
    mounted: function () {

        var me = this;
        var search = window.location.search;
        var openIdStr = search.split('&')[0];
        me.openId = openIdStr.split('=')[1];

    },
    methods: {
        submit: function () {
            var me = this;
            me.submiting = true;

            $.ajax({
                url: '/weixinBindUpdate',
                type: 'post',
                data: {
                    account: $.trim(me.account),
                    password: $.trim(me.password),
                    openId: $.trim(me.openId)
                },
                success: function (res) {
                    console.log(res);

                    var msg = res.msg;
                    var err = res.err;

                    if (err == '0') {
                        if (res.data.data.nModified > 0) {
                            msg = '微信号重新绑定，请返回到公众号主页重新查询！';
                        }
                        else {
                            msg = '微信号重新绑定失败，请确认是否更换新的账号！';
                            err = 4;
                        }
                    }

                    me.resErr = err;
                    me.tip = msg;
                    me.submiting = false;

                },
                error: function (err) {
                    console.log('error!');
                    console.log(err);
                    me.submiting = false;
                }
            });
        }
    },
    template: html
});