/**
 * user needs first to get a token from /login
 * they should copy and paste the valid token to the request header to access other routes
 * 
 */
'use strict'

var express = require('express');
var router = express.Router();
var passport = require('passport');
var util = require('util');
var utils = require('../utils');
var CryptoJS=require("crypto-js");
var base64=require("js-base64").Base64;
var mongoose = require('mongoose');

router.route('/login')
    .post(function(req, res){
        // hard code username and password to simply testing. 
        var username = "testing";
        var password = "apphw"
        var expiration = (parseInt(Date.now()/1000) + 3600);

        //handle the cases where user don't provide credentials
        if(req.headers.username == undefined){
            res.status(400).json( 
            {"statusCode":400, 
              "errorCode":"1002", 
              "errorMessage": "Please provide username to get a token." 
            });  
            return;                
        }
        if(req.headers.password == undefined){
            res.status(400).json( 
            {"statusCode":400, 
              "errorCode":"1002", 
              "errorMessage": "Please provide password to get a token." 
            });  
            return;                
        }        
        if(req.headers.username !== username || req.headers.password !== password){
            res.status(400).json( 
            {"statusCode":400, 
              "errorCode":"1001", 
              "errorMessage": "Either username or password is invalid" 
            });  
            return;             
        } 

        //valid login credentials: encrypt and hash the string to generate a token
        var clearString = username+":"+expiration;
        var hashString = CryptoJS.HmacSHA1(clearString,"APP");
        var cryptString = CryptoJS.AES.encrypt(clearString+":"+hashString,"Final").toString();
        var tokenToCopy = {token: base64.encode(cryptString)}

        //display the token in the response body
        res.status(200).json({"Notes":"Please copy and paste the following token to the request header.", tokenToCopy} );
        return;
    })

module.exports = router;