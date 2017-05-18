import css from './progress.css';
import html from './progress.html';

var app = new Vue({
    el: '#app',
    data: {
        schedule: '',
        getCourse: '',
        needCourse: '',
        getCredit: '',
        needCredit: ''
    },
    mounted: function () {

        var me = this;
        $.ajax({
            url: '/person/getProgress',
            type: 'post',
            data: {},
            success: function (res) {
                console.log(res);
                var data = res.data[0];
                var getCourse = [];
                var need = data.need;
                $.each(data.detail, function (index, ele) {
                    getCourse.push(ele.text);
                });

                me.schedule = getCourse.concat(data.need).length > 0
                    ? getCourse.concat(data.need).join('，') + '。'
                    : '暂无' + '。' ;
                me.getCourse =  getCourse.length > 0
                    ? getCourse.join('，') + '。'
                    : '暂无' + '。' ;
                me.needCourse = need.length > 0
                    ? need.join('，') + '。'
                    : '暂无' + '。';
            }
        });

        $.ajax({
            url: '/person/getCredit',
            type: 'post',
            data: {},
            success: function (res) {
                var data = res.data[0];
                me.getCredit = data.get_credit + '分';
                me.needCredit = data.need_credit + '分';
            }
        });

    },
    template: html
});