var MongoClient = require('mongodb').MongoClient;
var DB_CONN_STR = 'mongodb://localhost:27017/weixin';


var insertData = function(data, db, callback) {
    //连接到表 site
    //
    var userCollection = db.collection('User');


    userCollection.find({}).toArray(function (err, items) {

        if (!err) {

            var obj = {
                undergrduate: 0,
                grduate: 0,
                exit: 0,
                cancel: 0
            };

            for (var i = 0, len = items.length; i < len; i++) {
                var status = items[i]['status'];
                if (status === '正式生') {
                    obj['undergrduate']++;
                }
                else if (status === '毕业生') {
                    obj['grduate']++;
                }
                else if (status === '退学') {
                    obj['exit']++;
                }
                else if (status === '取消学籍') {
                    obj['cancel']++;
                }
            }
            // console.log(obj);
            var data = [{key: 'studentStatus', data: obj}];

            var collection = db.collection('Aggregation');

            // // //插入数据
            collection.insert(data, function(err, result) {
                if(err) {
                    console.log('Error:'+ err);
                }
                else {
                    console.log(result);
                }
            });

        }
        else {
            console.log(err);
        }

    });

}


MongoClient.connect(DB_CONN_STR, function(err, db) {
    console.log("连接成功！");
    console.log('开始' + new Date().getTime());

    insertData([], db, function(result) {
        console.log('数据写完' + new Date().getTime());
        db.close();
    });
});