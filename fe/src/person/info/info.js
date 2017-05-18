import css from './info.css';
import html from './info.html';

var app = new Vue({
    el: '#app',
    data: {
        info: {
            name: '',
            student_id: '',
            major: '',
            studyCenter: '',
            level: '',
            status: '',
            card_type: '',
            card_id: '',
            birthday: '',
            tel: '',
            email: ''
        },
        dict: {
            name: '姓名',
            student_id: '大工学号',
            major: '专业',
            studyCenter: '学习中心',
            level: '层次',
            status: '学员状态',
            card_type: '证件类型',
            card_id: '证件号码',
            birthday: '出生日期',
            tel: '联系电话',
            email: '邮箱'
        }
    },
    mounted: function () {
        this.init();
    },
    template: html,
    methods: {
        init: function () {
            var me = this;
            $.ajax({
                url: '/person/getInfo',
                data: {}, // 这里后台可以根据ip 获得session , session 包含studentid
                type: 'post',
                success: function (res) {
                    console.log(res);
                    var data = res.data;

                    me.info = {
                        name: data.name,
                        student_id: data.student_id,
                        major: data.major,
                        studyCenter: data.center,
                        level: data.level,
                        status: data.status,
                        card_type: data.card_type,
                        card_id: data.card_id,
                        birthday: data.birthday,
                        tel: data.tel,
                        email: data.email
                    };
                    // me.info.name = data.name
                },
                error: function (err) {
                    console.log(err);
                }
            })
        }
    },
    filters: {
        format: function (val) {
            return val || '未填写';
        }
    }
});