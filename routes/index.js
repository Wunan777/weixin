'use strict'

var moment = require('moment');


var mobileRoute = require('./mobileRoute');
var manageRoute = require('./manageRoute');

module.exports = function (app) {
    app.set('view engine', 'ejs');
    mobileRoute(app);
    manageRoute(app);
}
