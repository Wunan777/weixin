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
                url: '/manage/getAggregation',
                type: 'post',
                data: {},
                success: function (res) {
                    if (res.err == '0') {
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

            $.ajax({
                url: '/manage/getAnnual',
                type: 'post',
                data: {},
                success: function (res) {
                    if (res.err == '0') {
                        var arr = res.data;
                        var annualInfo = {};

                        $.each(arr, function (index, ele) {
                            if (ele['key'] === 'entryCount') {
                                annualInfo = ele['data'];
                                return false;
                            }
                        });

                        var xArr = [];
                        var yArr = [];

                        $.each(annualInfo, function (index, value) {
                            xArr.push(index + '年');
                            yArr.push(value);
                        });

                        me.createLineGraph(xArr, yArr, $(me.$el).find('#entry-count-graph')[0], '每年招生人数', '人', '数据截止到2017年5月');
                    }
                    else {
                        console.log('error!');
                        console.log(res.msg);
                    }
                }
            })
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
        createEntryCount: function (data) {

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
        },
        createLineGraph: function (xArr, yArr, dom, title, unitType, subtext) {

            var echartInstance = echarts.init(dom);
            var dataShadow = [];
            var max = Math.max.apply(null, yArr);

            // 所有最大值 ：除了10以内的数，最高位加1,其余位数为0。
            // 效果：实际值肯定大于等于最大值一半。

            if (max < 10) {
                max = 10;
            }
            else {
                var tempStr = max + '';
                var base = Math.pow(10, (tempStr.length - 1));
                max = Math.floor((max / base) + 1) * base;
            }

            for (var i = 0; i < xArr.length; i++) {
                dataShadow.push(max);
            }

            var option = {
                title: {
                    text: title,
                    subtext: subtext
                },
                tooltip: {
                    trigger: 'axis',
                    formatter: '{b} <br />{a}: {c}' + unitType
                },
                xAxis: {
                    data: xArr,
                    boundaryGap: true
                },
                yAxis: {
                    axisLabel: {
                        formatter: '{value} ' + unitType
                    }
                },
                series: [
                    {
                        name: '当月',
                        type: 'bar',
                        data: yArr,
                        itemStyle: {
                            normal: {
                                color: new echarts.graphic.LinearGradient(
                                    0, 0, 0, 1,
                                    [
                                        {offset: 0, color: '#d1f2f8'},
                                        {offset: 0.5, color: '#b0e5ed'},
                                        {offset: 1, color: '#82d1dd'}
                                    ]
                                )
                            }
                        }
                    },
                    { // For shadow
                        type: 'bar',
                        itemStyle: {
                            normal: {color: 'rgba(0,0,0,0.05)'}
                        },
                        data: dataShadow,
                        barGap: '-100%',
                        barCategoryGap: '60%',
                        animation: false
                    }
                ]
            };

            echartInstance.setOption(option);
        }
    }
});