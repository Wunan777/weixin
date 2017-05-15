




var MongoClient = require('mongodb').MongoClient;
var DB_CONN_STR = 'mongodb://localhost:27017/weixin';


var insertData = function(data, tableName, db, callback) {

    var collection = db.collection(tableName);
    collection.insert(data, function(err, result) {
        if(err) {
            console.log('Error:'+ err);
            callback();
        }
        else {
            console.log(result);
            callback();
        }
    });

}


MongoClient.connect(DB_CONN_STR, function(err, db) {
    console.log("连接成功！");
    var region = [
        {
            'id': 5,
            'name': '北京'
        },
        {
            'id': 14,
            'name': '江苏'
        },
        {
            'id': 15,
            'name': '浙江'
        },
        {
            'id': 16,
            'name': '安徽'
        },
        {
            'id': 17,
            'name': '福建'
        },
        {
            'id': 18,
            'name': '江西'
        },
        {
            'id': 19,
            'name': '山东'
        },
        {
            'id': 6,
            'name': '天津'
        },
        {
            'id': 7,
            'name': '上海'
        },
        {
            'id': 8,
            'name': '重庆'
        },
        {
            'id': 9,
            'name': '河北'
        },
        {
            'id': 10,
            'name': '山西'
        },
        {
            'id': 11,
            'name': '辽宁'
        },
        {
            'id': 12,
            'name': '长春'
        },
        {
            'id': 13,
            'name': '黑龙江'
        }
    ];

    insertData(region, 'Province', db, function(result) {
        console.log('数据写完' + new Date().getTime());
        db.close();
    });
});