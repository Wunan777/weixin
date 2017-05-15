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
        {"student_id" : "150999222005", "avg_score": "81", "gpa": "3.1"},
        {"student_id" : "130001203267", "avg_score": "84", "gpa": "3.37"}
    ];

    insertData(arr, 'StudentScore', db, function(result) {
        console.log('数据写完' + new Date().getTime());
        db.close();
    });
});
