import css from './weixinBind.css';
import html from './weixinBind.html';

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
                url: '/weixinBind',
                type: 'post',
                data: {
                    account: $.trim(me.account),
                    password: $.trim(me.password),
                    openId: $.trim(me.openId)
                },
                success: function (res) {
                    me.resErr = res.err;
                    me.tip = res.msg;
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