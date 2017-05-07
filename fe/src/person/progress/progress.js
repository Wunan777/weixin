import css from './progress.css';
import html from './progress.html';

var app = new Vue({
    el: '#app',
    data: {
        progress: {
            schedule: '日语，俄语，软件，自然科学',
            completedCourse: '日语',
            takingCourse: '软件',
            unCompletedCourse: '软件，自然科学'
        },
        dict: {
            schedule: '个人教学计划',
            completedCourse: '已修课程',
            takingCourse: '在修课程',
            unCompletedCourse: '未修课程'
        }
    },
    template: html
});