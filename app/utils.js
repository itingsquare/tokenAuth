/*DISLAIMER: This file is written under the guidance of Hector Guo*/

'use strict';

var CryptoJS = require('crypto-js');
const jwt = require('jsonwebtoken');


var config = {
    'secretKey': 'apphomework',
    // size of the generated hash
    'hashBytes': 32,
    'saltBytes': 16,
    'iterations': 100
};

/**
 * HTTP errors
 */
function reportError(statusCode, errorCode, errorMessage, res) {
    const statusMsg = {
        200: 'OK',
        201: 'Created',
        204: 'No Content',
        400: 'Bad Request',
        403: 'Forbidden',
        404: 'Not Found',
        500: 'Internal Error',
        501: 'Not implemented'
    };

/**
 * Response objects
 */
    res
        .status(statusCode)
        .json({
            status: statusCode,
            statusTxt: statusMsg[statusCode],
            errorCode,
            errorMessage,
            requestTime: Date.now()
        })
        .end();
}

/**
 * standardize error format
 */
function getErrorInfo(type, source, msg) {
    const errorType = {
        'notvalid': {errorCode: 1001, statusCode: 500, errorMessage: msg ? msg: `${source} is not valid` },
        'required': {errorCode: 1002, statusCode: 400, errorMessage: msg ? msg: `${source} required` },
        'typeError': {errorCode: 1003, statusCode: 400, errorMessage: msg ? msg: `${source} type error` },
        'empty': {errorCode: 1004, statusCode: 400, errorMessage: msg ? msg: 'empty body' },
        'format': {errorCode: 1005, statusCode: 400, errorMessage: msg ? msg: 'data format error' },
        'notValidAttr': {errorCode: 1006, statusCode: 400, errorMessage: msg ? msg: `attribute ${source} is not valid` },
        'noId': {errorCode: 1007, statusCode: 400, errorMessage: msg ? msg: 'Id should not be provided' },
        'duplicated': {errorCode: 1008, statusCode: 400, errorMessage: msg ? msg: `${source} duplicated` },
        'user defined': {errorCode: 1009, statusCode: 400, errorMessage: msg ? msg: `${source} is not unique` },
        'ObjectId': {errorCode: 1010, statusCode: 404, errorMessage: msg ? msg: `resouce ${source} not found`},
        'maxlength': {errorCode: 1001, statusCode: 400, errorMessage: msg ? msg: `longer than the maximum allowed length`},
        'minlength': {errorCode: 1001, statusCode: 400, errorMessage: msg ? msg: `shorter than the minimum allowed length`},
    };

    return errorType[type] ? errorType[type] : {
        errorCode: 9999,
        errorMessage: msg ? msg: `unknown error`,
        statusCode: 400
    };
};

function handleMongooError(err, res, source) {
    let errorInfo; 
    const detailErrors = err.errors;

    if (err && err.kind) {
        errorInfo = getErrorInfo(err.kind, err.path, err.message);
    } else if (detailErrors) {
        for(let errName in detailErrors) {
            if(detailErrors.hasOwnProperty(errName)) {
                errorInfo = getErrorInfo(detailErrors[errName].kind, errName, detailErrors[errName].message);
            }
        }
    } else {
        // custom error
        errorInfo = {
            statusCode: 400,
            errorCode: 1001,
            errorMessage: err.message
        }
    }
    reportError(errorInfo.statusCode, errorInfo.errorCode, errorInfo.errorMessage, res);
};
    
 function throwIfMissing(param) {
    throw new Error(`${param} required`);
};
        
function validateEmail(email) {
    var regEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regEx.test(email);
}

function validatePhoneNo(phone) {
    var regEx = /[\d]{3}-[\d]{3}-[\d]{4}/;
    return regEx.test(phone);
}   


/**
 * hash passwords and save it to database
 * DISCLAIMER: reference to the github example at https://gist.github.com/skeggse/52672ddee97c8efec269
 */
function hashPassword(password, callback) {
  // generate a salt for pbkdf2
  crypto.randomBytes(config.saltBytes, function(err, salt) {
    if (err) {
      return callback(err);
    }

    crypto.pbkdf2(password, salt, config.iterations, config.hashBytes,
      function(err, hash) {

      if (err) {
        return callback(err);
      }

      var combined = new Buffer(hash.length + salt.length + 8);

      // include the size of the salt so that we can, during verification,
      // figure out how much of the hash is salt
      combined.writeUInt32BE(salt.length, 0, true);
      // similarly, include the iteration count
      combined.writeUInt32BE(config.iterations, 4, true);

      salt.copy(combined, 8);
      hash.copy(combined, salt.length + 8);
      callback(null, combined);
    });
  });
}

/**
 * verify passwords with the hash
 * DISCLAIMER: reference to the github example at https://gist.github.com/skeggse/52672ddee97c8efec269
 */
function verifyPassword(password, combined, callback) {
  // extract the salt and hash from the combined buffer
  var saltBytes = combined.readUInt32BE(0);
  var hashBytes = combined.length - saltBytes - 8;
  var iterations = combined.readUInt32BE(4);
  var salt = combined.slice(8, saltBytes + 8);
  var hash = combined.toString('binary', saltBytes + 8);

  // verify the salt and hash against the password
  crypto.pbkdf2(password, salt, iterations, hashBytes, function(err, verify) {
    if (err) {
      return callback(err, false);
    }

    callback(null, verify.toString('binary') === hash);
  });
}

/**
 * get token
 */

function getToken(user){
    return jwt.sign(user, config.secretKey, {
        expiresIn: 3600
    });
};

/**
 * verify token
 */

function verifyToken(req, res, next){
    // check header or url parameters or post parameters for token
    var token = req.body.token || req.query.token || req.headers['x-access-token'];

    // decode token
    if (token) {
        // verifies secret and checks exp
        jwt.verify(token, config.secretKey, function (err, decoded) {
            if (err) {
                var err = new Error('You are not authenticated!');
                err.status = 401;
                return next(err);
            } else {
                // if everything is good, save to request for use in other routes
                req.decoded = decoded;
                next();
            }
        });
    } else {
        // if there is no token
        // return an error
        var err = new Error('No token provided!');
        err.status = 403;
        return next(err);
    }
};


module.exports = {
    reportError,
    handleMongooError,
    throwIfMissing,
    validateEmail,
    validatePhoneNo,
    hashPassword,
    verifyPassword,
    getToken,
    verifyToken
}


