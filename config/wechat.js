'use strict'
var token = 'hah123';

exports.config = {
    token: token,
    appid: 'wx56a612318aacf970',
    appsecret: '65f7a5066f84068addb40e9a1a128632',
    encodingAESKey: 'Sd2C1xR2ncU7y0Ibq1bq75sgrd0tihWS3gkRnUM1aDe',
    checkSignature: false // 可选，默认为true。由于微信公众平台接口调试工具在明文模式下不发送签名，所以如要使用该测试工具，请将其设置为false
};