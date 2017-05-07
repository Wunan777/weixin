'use strict'

var WechatAPI = require('wechat-api');
var menu = {
    "button":[
        {
         "type": "click",
         "name": "12312321",
         "key": "V1001_TODAY_MUSIC"
        },
        {
            "name": "菜单",
            "sub_button":[
                {
                 "type":"view",
                 "name":"搜索",
                 "url":"http://www.soso.com/"
                },
                {
                 "type":"click",
                 "name":"赞一下我们",
                 "key":"V1001_GOOD"
                }
            ]
         }
    ]
};

module.exports = function () {

    return function (opts) {
        // 初始化菜单
        var api = new WechatAPI(opts.appId, opts.appSecret);
        api.removeMenu();
        api.createMenu(menu, function () {
            console.log(arguments);
        });
    }

}