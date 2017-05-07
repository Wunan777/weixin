import css from './studyCenter.css';
import html from './studyCenter.html';

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
        resultList: [
            {
                text: '开发区校区',
            },
            {
                text: '主校区校区'
            },
            {
                text: '开发区校区1',
            },
            {
                text: '开发区校区2',
            }
        ]
    },
    template: html
});