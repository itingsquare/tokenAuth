/** 
 * Mongoose Schema for the Entity Car
 * @author Clark Jeria
 * @version 0.0.2
 * 
 * DISLAIMER: This file is written under the guidance of Hector Guo
 */

'use strict';
var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var CarSchema   = new Schema({
    license: {
        type: String,
        required: true,
        unique: true,
        maxlength: 10
    },
    model: {
        type: String,
        required: true,
        maxlength: 18
    },
    make: {
        type: String,
        required: true,
        maxlength: 18
    },
    doorCount: {
        type: Number,
        min: 1,
        max: 8,
        required: true    
    },
    driver: {
        type: String,
        unique: true,
        ref: 'Driver'
    }
});


module.exports = mongoose.model('Car', CarSchema);