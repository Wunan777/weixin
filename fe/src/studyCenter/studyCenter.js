import css from './studyCenter.css';
import html from './studyCenter.html';

var app = new Vue({
    el: '#app',
    data: {
        province: '-1',
        provinceList: [
        ],
        learnCenterList: [
        ]
    },
    mounted: function () {
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
                    me.province = me.provinceList[0]['id'];
                },
                error: function (err) {
                    console.log(err);
                }
            })
        }
    },
    watch: {
        province: function (newVal, oldVal) {
            var me  = this;
            $.ajax({
                url: '/studyCenter/learnCenter',
                type: 'post',
                data: {
                    cityId: (newVal + '')
                },
                success: function (res) {
                    me.learnCenterList = res.data;
                },
                error: function (err) {
                    console.log(err);
                }
            });
        }
    }
});