/** 
 * Example of RESTful API using Express and NodeJS
 * @author Clark Jeria
 * @version 0.0.2
 */

/** BEGIN: Express Server Configuration */
var express    = require('express');
var app        = express();
var bodyParser = require('body-parser');
var CryptoJS=require("crypto-js");
var base64=require("js-base64").Base64;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;

var mongoose    = require('mongoose');
mongoose.connect('mongodb://tingting:homework@ds019886.mlab.com:19886/honeybadger');
/** END: Express Server Configuration */

var utils = require('./utils');
/** BEGIN: Express Routes Definition */
var cars = require('./routes/cars');
var drivers = require('./routes/drivers');
var passengers = require('./routes/passengers');
var users = require('./routes/users');

// setup and sessions router do not need to verify token
app.use('/api', users);

/**
 * hard code username and password to simply testing. 
 * The user creation is beyond scope of the project.
 */
var username = "testing";
var password = "apphw"
var expiration = (parseInt(Date.now()/1000) + 3600);

// Authentication -- from Karim's class
app.use(function (req, res, next) {
    var headers = req.headers;
    var token = req.headers.token || req.query.token || req.headers['x-access-token'];

    if (req.url != '/api/login') {
        if (token === undefined) {
            res.status(404).json({
                'errorCode': '1012',
                'errorMessage': 'Missing token',
                'statusCode': '404'
            });
            return;
        } else {
            cryptedHash = base64.decode(token);
            uncryptedHash = CryptoJS.AES.decrypt(cryptedHash, "Final").toString(CryptoJS.enc.Utf8);

            try {
                username = uncryptedHash.split(':')[0];
                expiration = uncryptedHash.split(':')[1];
                clearString = username+":"+expiration;
                HashedClearString = uncryptedHash.split(':')[2];
                reHashedClearString = CryptoJS.HmacSHA1(clearString, "APP");
                if (HashedClearString != reHashedClearString) {
                    res.status(404).json({
                        'errorCode': '1012',
                        'errorMessage': 'Invalid Token',
                        'statusCode': '404'
                    });
                    return;
                } 
            } catch (error) {
                res.status(404).json({ 'errorCode': '1013', 'errorMessage': 'Invalid Token', 'statusCode': '404' });
                return;
            }
            if (expiration < parseInt(Date.now()/1000)) {
                res.status(404).json({ 'errorCode': '1014', 'errorMessage': 'Expired Token', 'statusCode': '404' });
                return;
            } else {
                console.log("decrypt success!");
            }
        }
    }
    next();
});


app.use('/api', cars);
app.use('/api', drivers);
app.use('/api', passengers);
//app.use('/api', router);
/** END: Express Routes Definition */


/** BEGIN: Express Server Start */
app.listen(port);
console.log('Service running on port ' + port);

module.exports = app;
/** END: Express Server Start */