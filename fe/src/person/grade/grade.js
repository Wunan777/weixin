import css from './grade.css';
import html from './grade.html';

var app = new Vue({
    el: '#app',
    data: {
        grade: {
            math: '90',
            software: '80',
            english: '90'
        },
        info: {
            testNum: '3',
            failNum: '1',
            noTestNum: '8'
        }
    },
    template: html
});