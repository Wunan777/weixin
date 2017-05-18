var MongoClient = require('mongodb').MongoClient;
var DB_CONN_STR = 'mongodb://localhost:27017/weixin';


var insertData = function(data, tableName, db, callback) {

    var collection = db.collection(tableName);
    collection.insert(data, function(err, result) {
        if(err) {
            console.log('Error:'+ err);
        }
        else {
            console.log(result);
        }
    });

}


MongoClient.connect(DB_CONN_STR, function(err, db) {
    console.log("连接成功！");
    var arr = [
        {
            "student_id" : "150999222005",
            "avg_score": "81",
            "gpa": "3.1",
            'detail':[
                {
                    'text': '毛泽东思想和中国特色社会系统论',
                    'value': '76'
                },
                {
                    'text': '钢筋混凝土结构',
                    'value': '72'
                },
                {
                    'text': '高等数学',
                    'value': '81'
                },
                {
                    'text': '工程项目管理',
                    'value': '88'
                },
                {
                    'text': '会记学',
                    'value': '90'
                },
                {
                    'text': '应用统计',
                    'value': '77'
                },
                {
                    'text': 'C/C++语言程序设计',
                    'value': '68'
                },
                {
                    'text': '英语',
                    'value': '88'
                },
                {
                    'text': '战略管理',
                    'value': '80'
                },
                {
                    'text': '工程经济学',
                    'value': '76'
                }
            ],
            'need': [
                '国际金融', '高级财务会计', '房地产开发与经营', '毕业设计'
            ],
            'info': {
                testNum: '11',
                failNum: '0',
                noTestNum: '4'
            }
        },
        {
            "student_id" : "130001203267",
            "avg_score": "84",
            "gpa": "3.37",
            'detail':[
                {
                    'text': '毛泽东思想和中国特色社会系统论',
                    'value': '76'
                },
                {
                    'text': '软件工程',
                    'value': '84'
                },
                {
                    'text': '钢筋混凝土结构',
                    'value': '72'
                },
                {
                    'text': '高等数学',
                    'value': '81'
                },
                {
                    'text': '工程项目管理',
                    'value': '88'
                },
                {
                    'text': '建筑材料',
                    'value': '90'
                },
                {
                    'text': '水工建筑物',
                    'value': '80'
                },
                {
                    'text': '应用统计',
                    'value': '77'
                },
                {
                    'text': 'C/C++语言程序设计',
                    'value': '68'
                },
                {
                    'text': '机械工程材料',
                    'value': '80'
                },
                {
                    'text': '电工学',
                    'value': '80'
                },
                {
                    'text': '英语',
                    'value': '88'
                },
                {
                    'text': '战略管理',
                    'value': '80'
                },
                {
                    'text': '工程经济学',
                    'value': '76'
                },
                {
                    'text': '毕业设计',
                    'value': '90'
                }
            ],
            need: [],
            'info': {
                testNum: '14',
                failNum: '0',
                noTestNum: '0'
            }
        }
    ];

    insertData(arr, 'StudentScore', db, function(result) {
        console.log('数据写完' + new Date().getTime());
        db.close();
    });
});
