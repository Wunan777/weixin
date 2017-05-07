import css from './info.css';
import html from './info.html';

var app = new Vue({
    el: '#app',
    data: {
        info: {
            name: '张三',
            id: '1322221230123412',
            studyCenter: '大连开发区校区',
            level: '初级',
            major: 'software',
            requiredScore: '10',
            getScore: '1'
        },
        dict: {
            name: '姓名',
            id: '证件号码',
            studyCenter: '学习中心',
            level: '层次',
            major: '专业',
            requiredScore: '教学计划规定学分',
            getScore: '已修学分'
        }
    },
    template: html
});