import css from './statistic.css';
import html from './statistic.html';

var app = new Vue({
    el: '#app',
    data: {
    },
    mounted: function () {
        var me = this;
        me.getWeekPv();
        me.getWeekUv();
    },
    template: html,
    methods: {
        createQuery: function (today) {
            var arr = [];
            var day = today;
            for (var i = 0, len = 7; i < len; i++) {
                arr.push(day);
                var timeStamp = (parseInt(moment(day).format('X')) - 24 * 3600);
                day = moment.unix(timeStamp).format('YYYY-MM-DD');
            }
            return arr;
        },
        getWeekPv: function () {
            var me = this;
            var today = moment().format('YYYY-MM-DD');
            var arr = me.createQuery(today);

            $.ajax({
                url: '/manage/getPv',
                type: 'post',
                data: {
                    query: arr
                },
                success: function (res) {
                    var data = res.data;
                    var xArr = arr;
                    var yArr = [];

                    $.each(xArr, function (index, value) {
                        yArr.push(data[value] || 0);
                    });
                    xArr = xArr.reverse();
                    yArr = yArr.reverse();

                    me.createLineGraph(xArr, yArr, $(me.$el).find('#pv-graph')[0], 'pv访问量');
                },
                error: function (err) {
                    console.log('error!');
                    console.log(err);
                }

            });
        },
        getWeekUv: function () {
            var me = this;
            var today = moment().format('YYYY-MM-DD');
            var arr = me.createQuery(today);

            $.ajax({
                url: '/manage/getUv',
                type: 'post',
                data: {
                    query: arr
                },
                success: function (res) {
                    console.log(res);
                    var data = res.data;
                    var xArr = arr;
                    var yArr = [];

                    $.each(xArr, function (index, value) {
                        yArr.push(data[value] || 0);
                    });
                    xArr = xArr.reverse();
                    yArr = yArr.reverse();

                    me.createLineGraph(xArr, yArr, $(me.$el).find('#uv-graph')[0], 'uv访问量');
                },
                error: function (err) {
                    console.log('error!');
                    console.log(err);
                }

            });

        },
        createLineGraph: function (xArr, yArr, dom, title) {

            var echartInstance = echarts.init(dom);
            var unitType = '次';
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
                    subtext: '最近一周'
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