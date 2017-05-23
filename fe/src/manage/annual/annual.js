import css from './annual.css';
import html from './annual.html';

var app = new Vue({
    el: '#app',
    data: {
        majorSelectYear: '',
        centerSelectYear: '',
        majorYear: [],
        centerYear: [],
        majorData: {},
        centerData: {}
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
                url: '/manage/getAnnual',
                type: 'post',
                data: {},
                success: function (res) {

                    var arr = res.data;
                    var majorData = {};
                    var centerData = {};

                    $.each(arr, function (index, ele) {
                        if (ele['key'] === 'major') {
                            majorData = ele['data'];
                        }
                        else if (ele['key'] === 'center') {
                            centerData = ele['data'];
                        }
                    });

                    me.majorData = majorData;
                    me.centerData = centerData;

                    me.setYearArr('majorYear', 'majorSelectYear', majorData);
                    me.setYearArr('centerYear', 'centerSelectYear', centerData);
                }
            });

        },
        setYearArr: function(name, selectName, data) {
            var me = this;
            var arr = [];
            $.each(data, function (key, ele) {
                arr.push(key);
            });
            me[name] = arr.reverse();
            // 取数组第一个为选中的
            me[selectName] = arr[0];
        },
        createQuery: function (data) {
            var obj = {};
            $.each(data, function (year, perYearData) {
                obj[year] = {};
                obj[year]['xArr'] = [];
                obj[year]['yArr'] = [];

                perYearData.sort(function (a,b) {
                    return a.value - b.value;
                });

                $.each(perYearData, function (index, ele) {
                    obj[year]['xArr'].push(ele['text']);
                    obj[year]['yArr'].push(ele['value']);
                });
                obj[year]['xArr'].reverse();
                obj[year]['yArr'].reverse();
            });

            return obj;
        },
        createMajorGraph: function (year) {
            var me = this;
            var data = me.majorData;
            var thisYear = me.createQuery(data)[year];
            var xArr = thisYear.xArr;
            var yArr = thisYear.yArr;
            me.createLineGraph(xArr, yArr, $(me.$el).find('#major-graph')[0], '专业人数统计', '人', year + '年')
        },
        createCenterGraph: function (year) {
            var me = this;
            var data = me.centerData;
            var thisYear = me.createQuery(data)[year];
            var xArr = thisYear.xArr;
            var yArr = thisYear.yArr;
            me.createLineGraph(xArr, yArr, $(me.$el).find('#center-graph')[0], '学习中心人数统计', '人', year + '年')
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
                dataZoom: [
                    {
                        id: 'dataZoomX',
                        type: 'slider',
                        xAxisIndex: [0],
                        filterMode: 'filter', // 设定为 'filter' 从而 X 的窗口变化会影响 Y 的范围。
                        start: 0,
                        end: 16
                    },
                    {
                        type: 'inside',
                        xAxisIndex: [0],
                        start: 1,
                        end: 35
                    }
                ],
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
    },
    watch: {
        majorSelectYear: function (val, oldVal) {
            this.createMajorGraph(val);
        },
        centerSelectYear: function (val, oldVal) {
            this.createCenterGraph(val);
        }
    }
});