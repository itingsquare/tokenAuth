/** 
 * Express Route: /
 */

var express = require('express');
var router = express.Router();
var util = require('util');
var mongoose     = require('mongoose');

var CryptoJS=require("crypto-js");
var base64=require("js-base64").Base64;

/**
 * Initial route of the API for connection testing purpouses
 * @returns {object} A string message.
 */
router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to APP Uber CMU!' });   
});


router.route('/sessions')

    .post(function(req, res){
        username = "john";
        expiration = (parseInt(Date.now()/1000) + 3600);
        clearString = username+":"+expiration;
        hashString = CryptoJS.HmacSHA1(clearString,"APP");
        cryptString = CryptoJS.AES.encrypt(clearString+":"+hashString,"Secret").toString();
        response = {token: base64.encode(cryptString)}
        console.log("token", response)
        res.status(200).json(response);
    });


module.exports = router;