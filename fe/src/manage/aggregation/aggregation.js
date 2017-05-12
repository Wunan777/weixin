import css from './aggregation.css';
import html from './aggregation.html';

var app = new Vue({
    el: '#app',
    data: {
        'studentAge': {},
        'studentLevel': {},
        'studentStatus': {}
    },
    mounted: function () {
        var me = this;
        me.init();
    },
    template: html,
    methods: {
        init: function () {
            var me = this;
            $.ajax({
                url: 'getAggregation',
                type: 'post',
                data: {},
                success: function (res) {
                    if (res.err == '0') {
                        console.log(res);
                        $.each(res, function (index, ele) {
                            me[ele.key] = ele.data;
                        });
                    }
                    else {
                        console.log('error!');
                        console.log(res.msg);
                    }

                }
            });
        },
        createQuery: function () {

        }
    }
});