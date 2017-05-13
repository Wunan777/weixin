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
            var container = $(me.$el);
            $.ajax({
                url: 'getAggregation',
                type: 'post',
                data: {},
                success: function (res) {
                    if (res.err == '0') {
                        console.log(res);
                        var arr = res.data;
                        $.each(arr, function (index, ele) {
                            me[ele.key] = ele.data;
                        });
                        me.createAge(me['studentAge']);
                        me.createLevel(me['studentLevel']);
                        me.createStatus(me['studentStatus']);
                    }
                    else {
                        console.log('error!');
                        console.log(res.msg);
                    }

                }
            });
        },
        createAge: function (data) {
            var me = this;
            var container = $(me.$el);
            var ageXArr = [];
            var ageYArr = [];
            $.each(data, function (key, value) {
                if (key != '40' && key != '50' ) {
                    var name = key + '后';
                    ageXArr.push(name);
                    ageYArr.push({
                        name: name,
                        value: value
                    });
                }
            });

            me.createPieGraph(ageXArr, ageYArr, container.find('#age-graph')[0], '学员年龄信息统计');
        },
        createLevel: function (data) {
            var me = this;
            var container = $(me.$el);
            var levelXArr = [];
            var levelYArr = [];

            $.each(data, function (key, value) {
                console.log(key);
                if (key === 'gqz') {
                    var name = '高起专';
                }
                else if (key === 'zsb') {
                    var name = '专升本';
                }
                levelXArr.push(name);
                levelYArr.push({
                    name: name,
                    value: value
                });
            });

            me.createPieGraph(levelXArr, levelYArr, container.find('#level-graph')[0], '学员Level统计');

        },
        createStatus: function (data) {
            var me = this;
            var container = $(me.$el);
            var xArr = [];
            var yArr = [];

            $.each(data, function (key, value) {

                var name = key;
                if (key === 'grduate') {
                    name = '毕业生';
                }
                else if (key === 'undergrduate') {
                    name = '在读生';
                }
                else if (key === 'cancel') {
                    name = '取消学籍';
                }
                else if (key === 'exit') {
                    name = '退学';
                }

                xArr.push(name);
                yArr.push({
                    name: name,
                    value: value
                });
            });

            me.createPieGraph(xArr, yArr, container.find('#status-graph')[0], '学员学籍状态统计');
        },
        createPieGraph: function (xArr, yArr, dom, title) {
            var me = this;
            var echartInstance = echarts.init(dom);

            var option = {
                title : {
                    text: title,
                    x:'center'
                },
                tooltip : {
                    trigger: 'item',
                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                },
                toolbox: {
                    show : true,
                    feature : {
                        mark : {show: true},
                        dataView : {show: true, readOnly: false},
                        magicType : {
                            show: true,
                            type: ['pie', 'funnel']
                        },
                        restore : {show: true},
                        saveAsImage : {show: true}
                    }
                },
                calculable : true,
                legend: {
                        x : 'center',
                        y : 'bottom',
                        data: xArr
                },
                series : [
                    {
                        type:'pie',
                        radius : [30, 110],
                        roseType : 'area',
                        data: yArr
                    }
                ]
            };
            echartInstance.setOption(option);
        }
    }
});