import css from './onlineApplication.css';
import html from './onlineApplication.html';

var app = new Vue({
    el: '#app',
    data: {
        selected: {
            province: '1',
            learnCenter: '1',
            level: '1',
            subject: '1',
            name: '',
            tel: ''
        },
        province: '',
        provinceList: [],
        learnCenterList: [],
        levelList: [
            {
                text: '高起专',
                value: '1'
            },
            {
                text: '转升本',
                value: '2'
            }
        ],
        subjectList: [],
        isAllSelected: false,
        err: {
            code: '0',
            msg: ''
        }
    },
    created: function () {
        var me = this;
        me.init();
    },
    template: html,
    methods: {
        init: function () {
            var me = this;

            $.ajax({
                url: '/studyCenter/province',
                type: 'post',
                data: {},
                success: function (res) {
                    me.provinceList = res.data;
                    me.selected.province = me.provinceList[0]['id'];
                },
                error: function (err) {
                    console.log(err);
                }
            });

            $.ajax({
                url: '/studyCenter/subject',
                type: 'post',
                data: {},
                success: function (res) {
                    me.subjectList = res.data;
                    me.selected.subject = me.subjectList[0]['name'];
                },
                error: function (err) {
                    console.log(err);
                }
            });

        },
        checkPhone: function(tel) {
            var reg = /^1[3|4|5|7|8][0-9]{9}$/;
            var flag = reg.test(tel);
            return flag;
        },
        submit: function() {
            var me = this;
            var tel = me.selected.tel;

            if (!me.checkPhone(tel)) {
                me.err = {
                    code: '1',
                    msg: '手机号格式有误！'
                };
            }
            else {
                me.err = {
                    code: '0',
                    msg: '信息提交成功，我们会与您进行联系，请留意手机信息！'
                };
                setTimeout(function () {
                    window.history.go(-1);
                }, 3000);
            }
        }
    },
    watch: {
        'selected.province': function (val, oldValue) {
            var me = this;
            $.ajax({
                url: '/studyCenter/learnCenter',
                type: 'post',
                data: {
                    cityId: (val + '')
                },
                success: function (res) {
                    me.learnCenterList = res.data;
                    me.selected.learnCenter = me.learnCenterList[0]['LC_ID'];
                },
                error: function (err) {
                    console.log(err);
                }
            });

        },
        'selected': {
            handler: function (obj) {
                var me = this;
                if (obj.name && obj.tel) {
                    me.isAllSelected = true;
                }
                else {
                    me.isAllSelected = false;
                }
            },
            deep: true
        }
    }
});