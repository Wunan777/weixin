var webpack = require('webpack');
var path = require('path');


module.exports = {
    entry: {
        'index': path.resolve(__dirname, './fe/src/index/index.js'),
        'introduction': path.resolve(__dirname, './fe/src/introduction/introduction.js'),
        'majorIntroduction': path.resolve(__dirname, './fe/src/majorIntroduction/majorIntroduction.js'),
        'collegeDynamics': path.resolve(__dirname, './fe/src/collegeDynamics/collegeDynamics.js'),
        'onlineApplication': path.resolve(__dirname, './fe/src/onlineApplication/onlineApplication.js'),
        'studyCenter': path.resolve(__dirname, './fe/src/studyCenter/studyCenter.js'),
        'help': path.resolve(__dirname, './fe/src/help/help.js'),
        'contactUs': path.resolve(__dirname, './fe/src/contactUs/contactUs.js'),
        'login':  path.resolve(__dirname, './fe/src/login/login.js'),
        'logout':  path.resolve(__dirname, './fe/src/logout/logout.js'),
        'personinfo': path.resolve(__dirname, './fe/src/person/info/info.js'),
        'personprogress': path.resolve(__dirname, './fe/src/person/progress/progress.js'),
        'persongrade': path.resolve(__dirname, './fe/src/person/grade/grade.js'),
        'personroom': path.resolve(__dirname, './fe/src/person/room/room.js'),
        'weixinBind': path.resolve(__dirname, './fe/src/weixinBind/weixinBind.js'),
        'weixinBindUpdate': path.resolve(__dirname, './fe/src/weixinBindUpdate/weixinBindUpdate.js'),
        'manage/statistic': path.resolve(__dirname, './fe/src/manage/statistic/statistic.js'),
        'manage/aggregation': path.resolve(__dirname, './fe/src/manage/aggregation/aggregation.js')
    },
    output: {
        path: path.resolve(__dirname, './fe/js/'),
        filename: '[name].js'
    },
    module: {
        loaders:[
            {
                test: /\.css$/,
                loader: 'style-loader!css-loader',
                include: path.resolve(__dirname, "./fe/src"),
                exclude: /node_modules/
            },
            {
                test: /\.html$/,
                loader: 'html-loader',
                include: path.resolve(__dirname, "./fe/src"),
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                include: path.resolve(__dirname, "./fe/src"),
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "babel-loader",
                query: {
                    presets: ['es2015']
                }
            }
        ]
    }
}