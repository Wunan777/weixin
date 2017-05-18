import css from './logout.css';
import html from './logout.html';

var app = new Vue({
    el: '#app',
    data: {},
    mounted: function () {
        setTimeout(function () {
            window.location.href = '/index';
        }, 800);

    },
    template: html
});