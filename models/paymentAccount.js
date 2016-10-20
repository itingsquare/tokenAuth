/** 
 * Mongoose Schema for the Entity Payment Account
 * @author Tingting Feng
 * @version 0.0.2
 * 
 * DISLAIMER: This file is written under the guidance of Hector Guo
 */
'use strict';
var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var PaymentAcctSchema   = new Schema({
    accountType: {
        type: String,
        required: true,
        maxlength: 18
    },
    accountNumber: {
        type: Number,
        required: true,
        unique: true,
        maxlength: 18
    },
    expirationDate: {
        type: Number
    },
    nameOnAccount: {
        type: String,
        maxlength: 18,
        required: true    
    },
    bank: {
        type: Number,
        required: true,
        refer: 'Driver'
    },
    driver_id: String,
    passenger_id: String
});

module.exports = mongoose.model('PaymentAccount', PaymentAcctSchema);