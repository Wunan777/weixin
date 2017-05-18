import css from './grade.css';
import html from './grade.html';

var app = new Vue({
    el: '#app',
    data: {
        scoreList: [],
        info: {
        },
        avg_score: '',
        gpa: ''

    },
    mounted: function () {
        var me = this;
        $.ajax({
            url: '/person/getScore',
            type: 'post',
            data: {},
            success: function (res) {
                var data = res.data[0];
                me.scoreList = data.detail;
                me.info = data.info;
                me.gpa = data.gpa;
                me.avg_score = data.avg_score;
            }
        })
    },
    template: html
});