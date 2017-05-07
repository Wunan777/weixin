import css from './onlineApplication.css';
import html from './onlineApplication.html';

var app = new Vue({
    el: '#app',
    data: {
        selected: {
            province: 1
        },
        province: [
            {
                text: '辽宁',
                value: '1'
            },
            {
                text: '山东',
                value: '2'
            }
        ],
        city: [
            {
                text: '北京',
                value: '1'
            },
            {
                text: '大连',
                value: '2'
            }
        ],
        isAllSelected: 0
    },
    template: html
});