'use strict'

var moment = require('moment');
var cookieParser = require('cookie-parser');
var session = require('express-session');


var mobileRoute = require('./mobileRoute');
var manageRoute = require('./manageRoute');

module.exports = function (app) {
    app.set('view engine', 'ejs');
    app.use(cookieParser());

    app.use(session({
        secret: Math.random() + '',
        cookie: {
            maxAge:  24 * 3600 * 1000 // ms
        },
        resave: false,
        saveUninitialized: true
    }));

    mobileRoute(app);
    manageRoute(app);
}
