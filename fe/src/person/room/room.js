import css from './room.css';
import html from './room.html';

var app = new Vue({
    el: '#app',
    data: {
        room: [
        ]
    },
    mounted: function () {
        this.init();
    },
    template: html,
    methods: {
        init: function () {
            var me = this;
            $.ajax({
                url: '/person/getRoom',
                type: 'post',
                data: {},
                success: function (res) {
                    if (res.data.length > 0) {
                        room
                        $.each(res.data, function (index, ele) {
                            var obj = {
                                time: ele['time'],
                                room: ele['room']
                            };
                            me.room.push(obj);
                        });
                    }
                },
                error: function (err) {
                    console.log(err);
                }
            });
        }
    }
});