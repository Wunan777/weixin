import css from './room.css';
import html from './room.html';

var app = new Vue({
    el: '#app',
    data: {
        room: [
            {
                time: '13:00',
                region: '西综A310'
            },
            {
                time: '20:00',
                region: '西综A311'
            }
        ]
    },
    template: html
});