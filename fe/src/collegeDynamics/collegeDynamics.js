import css from './collegeDynamics.css';
import html from './collegeDynamics.html';

var app = new Vue({
    el: '#app',
    data: {
        news: [
            {
                title: '远程与继续教育学院开设“数控机床开放式众创”公开微课程',
                time: '2017-04-26',
                url: 'http://www.edlut.com/NewsState/showContent/a_id/2417/'
            },
            {
                title: '学院2017年春季学期毕业论文答辩工作顺利完成',
                time: '2017-04-26',
                url: 'http://www.edlut.com/NewsState/showContent/a_id/2418/'
            },
            {
                title: '培训中心举办“全民健身工作理论与实践专题培训班”',
                time: '2017-04-25',
                url: 'http://www.edlut.com/NewsState/showContent/a_id/2416/'
            },
            {
                title: '培训中心举办“柳州市鱼峰区、阳和工业新区财税骨干综合素质提升班”',
                time: '2017-04-07',
                url: 'http://www.edlut.com/NewsState/showContent/a_id/2422/'
            },
            {
                title: '第二期大连市农业职业经理人认证培训班圆满结束',
                time: '2017-04-06',
                url: 'http://www.edlut.com/NewsState/showContent/a_id/2411/'
            }
        ]
    },
    template: html
});