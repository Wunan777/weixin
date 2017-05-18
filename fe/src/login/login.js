import css from './login.css';
import html from './login.html';

var app = new Vue({
    el: '#app',
    data: {
        account: '',
        password: '',
        resErr: -1,
        tip: '',
        submiting: false
    },
    mounted: function () {
        var me = this;
    },
    methods: {
        submit: function () {
            var me = this;
            me.submiting = true;

            $.ajax({
                url: '/login',
                type: 'post',
                data: {
                    account: $.trim(me.account),
                    password: $.trim(me.password)
                },
                success: function (res) {
                    me.resErr = res.err;
                    me.tip = res.msg;
                    me.submiting = false;
                    if (res.err == '0') {
                        setTimeout(function () {
                            window.location.href = '/index';
                        }, 400);
                    }
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