'use strict'

// 简单加密， 前两位是2个随机的字母与数字组合
exports.enCryption = function (str) {

    var part = (Math.round(Math.random() * 100) + 100).toString(36).slice(0, 2);
    return (part + str);
}

exports.deCryption = function (str) {
    return str.slice(2);
}
