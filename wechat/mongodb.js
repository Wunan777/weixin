'use strict'

var MongoClient = require('mongodb').MongoClient;
var DB_CONN_STR = 'mongodb://localhost:27017/weixin';

exports.insert = function (tableName, arr, opCallback) {

    // 插入返回状态码
    // 0 插入正确
    // 1 数据库在查找过程中出错！
    // 2 插入的表名无效！
    // 3 传入的参数有误！

    if (tableName && arr instanceof Array && arr.length > 0) {

        if (tableName === 'WeixinBindList') {
            MongoClient.connect(DB_CONN_STR, function(err, db) {
                console.log("mongo连接成功！");

                insertData({
                    tableName: 'WeixinBindList',
                    data: arr,
                    db: db,
                    success: function(result) {
                        opCallback({'err': 0, 'msg': 'ok'});
                        db.close();
                    },
                    error: function (err) {
                        opCallback({'err': 1, 'msg': '数据库在插入过程中出错'});
                        db.close();
                    }
                })
            });

        }
        else {
            opCallback({'err': 2, 'msg': '插入的表名无效！'});
        }

    }
    else {
        opCallback({'err': 3, 'msg': '传入的参数有误！'});
    }

}

exports.find = function (tableName, query, opCallback) {
    // 查询返回状态码
    // 0 查询正确
    // 1 数据库在查找过程中出错！
    // 2 数据库服务未开启或所查表名不存在！
    // 3 传入的参数有误
    if (tableName && query instanceof Object) {

        MongoClient.connect(DB_CONN_STR, function(err, db) {
            if (db && db.collection) {
                console.log("mongo连接成功！");
                findData({
                    tableName: tableName,
                    query: query,
                    db: db,
                    success: function (data) {
                        opCallback({'err': 0, 'msg': 'ok', data: data});
                        db.close();
                    },
                    error: function (err) {
                        opCallback({'err': 1, 'msg': '数据库在查找过程中出错！', 'detail': err});
                        db.close();
                    }
                });
            }
            else {
                console.log("mongo连接失败！");
                opCallback({'err': 2, 'msg': '数据库服务未开启或所查表名不存在！'});
            }

        });

    }
    else {
        opCallback({'err': 3, 'msg': '传入的参数有误'});
    }

}

exports.update = function (tableName, query, set, opCallback) {

    if (tableName && query instanceof Object && set instanceof Object) {

        MongoClient.connect(DB_CONN_STR, function(err, db) {
            if (db && db.collection) {
                console.log("mongo连接成功！");
                updateData({
                    tableName: tableName,
                    query: query,
                    set: set,
                    db: db,
                    success: function (data) {
                        opCallback({'err': 0, 'msg': 'ok', data: data});
                        db.close();
                    },
                    error: function (err) {
                        opCallback({'err': 1, 'msg': '数据库在更新过程中出错！', 'detail': err});
                        db.close();
                    }
                });

            }
            else {
                console.log("mongo连接失败！");
                opCallback({'err': 2, 'msg': '数据库服务未开启或所查表名不存在！'});
            }
        });

    }
    else {
        opCallback({'err': 3, 'msg': '传入的参数有误'});
    }
}


function insertData(opts) {
    var tableName = opts.tableName;
    var data = opts.data;
    var db = opts.db;

    //连接到表 site
    var collection = db.collection(tableName);
    //插入数据
    collection.insert(data, function(err, result) {
        if (err) {
            opts.error(err);
        }
        else {
            opts.success(result);
        }
    });
}

function findData(opts) {
    var tableName = opts.tableName;
    var query = opts.query;
    var db = opts.db;

    //连接到表 site
    var collection = db.collection(tableName);
    collection.find(query).toArray(function (err, items) {

        if (!err) {
            opts.success(items);
        }
        else {
            opts.error(err);
        }

    });

}
function updateData(opts) {
    var tableName = opts.tableName;
    var query = opts.query;
    var set = opts.set;
    var db = opts.db;

    var collection = db.collection(tableName);
    collection.update(query, set, {upsert: false}, function (err, result) {
        if (!err) {
            opts.success(result);
        }
        else {
            opts.error(err);
        }
    });

}