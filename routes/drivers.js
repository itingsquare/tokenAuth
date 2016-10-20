/** 
 * Express Route: /drivers
 * 
 * DISLAIMER: This file is written under the guidance of Hector Guo
 */
'use strict';

var express = require('express');
var router = express.Router();
var Driver = require('../models/driver');
var Car = require('../models/car');
var PayAccount = require('../models/paymentAccount');
var utils = require('../utils');

var ModelHandle = require('./handler');
var driverHandle = new ModelHandle(Driver, 'Driver');
var carHandle = new ModelHandle(Car, 'Car');
var accountHandle = new ModelHandle(PayAccount, 'Payment Account');

router.route('/drivers')
    /**
     * GET call for the driver entity (multiple).
     * @returns {object} A list of drivers. (200 Status Code)
     * @throws Mongoose Database Error (500 Status Code)
     */
    .get((req, res) => {
        driverHandle.get()
            .then((drivers) => {
                res.status(200).json(drivers);
            })
            .catch((err) => {
                utils.handleMongooError(err, res);
            });
    })
    /**
     * POST call for the driver entity.
     * @param {string} license - The license plate of the new driver
     * @returns {object} A message and the driver created. (201 Status Code)
     * @throws Mongoose Database Error (500 Status Code)
     */
    .post((req, res) => {
        driverHandle.create(req.body)
            .then((response) => {
                res.status(201).json(response);
            })
            .catch((err) => {
                utils.handleMongooError(err, res);
            });
    });

/** 
 * Express Route: /drivers/:driver_id
 * @param {string} driver_id - Id Hash of driver Object
 */
router.route('/drivers/:driver_id')
    /**
     * GET call for the driver entity (single).
     * @returns {object} the driver with Id driver_id. (200 Status Code)
     * @throws Mongoose Database Error (500 Status Code)
     */
    .get(function (req, res) {
        driverHandle.get(req.params.driver_id)
            .then((driver) => {
                res.status(200).json(driver);
            })
            .catch((err) => {
                utils.handleMongooError(err, res);
            });
    })
    /**
     * PATCH call for the driver entity (single).
     * @returns {object} A message and the driver updated. (200 Status Code)
     * @throws Mongoose Database Error (500 Status Code)
     */
    .patch(function (req, res) {
        driverHandle.update(req.params.driver_id, req.body)
            .then((response) => {
                res.status(200).json(response);
            })
            .catch((err) => {
                utils.handleMongooError(err, res);
            });
    })
    /**
     * DELETE call for the driver entity (single).
     * @returns {object} A string message. (200 Status Code)
     * @throws Mongoose Database Error (500 Status Code)
     */
    .delete(function (req, res) {
        driverHandle.del(req.params.driver_id)
            .then((response) => {
                res.json(response);
            })
            .catch((err) => {
                utils.handleMongooError(err, res);
            })
    });


router.route('/drivers/:driver_id/cars')
    .get((req, res) => {
        Car.find({driver: req.params.driver_id}, (err, cars) => {
            if(err) {
                utils.handleMongooError(err, res);
                return;
            }
            res.status(200).json(cars);
        })
    })
    .post((req, res) => {
        driverHandle.get(req.params.driver_id)
            .then((driver) => {
                req.body.driver = driver._id;
                return carHandle.create(req.body);
            })
            .then((response) => {
                res.json(response);
            })
            .catch((err) => {
                utils.handleMongooError(err, res);
            });
    });

router.route('/drivers/:driver_id/paymentaccounts')
    .get((req, res) => {
        PayAccount.find({driver_id: req.params.driver_id}, (err, account) => {
            if(err) {
                utils.handleMongooError(err, res);
                return;
            }
            res.status(200).json(account);
        })
    })
    .post((req, res) => {
        if(!req.body.bank) {
            utils.handleMongooError({
                kind: 'required',
                path: req.path,
                message: 'bank required'
            }, res);
            return;
        }
        driverHandle.get(req.params.driver_id)
            .then((driver) => {
                req.body.driver = driver._id;
                return accountHandle.create(req.body);
            })
            then((response) => {
                res.json(response);
            })
            .catch((err) => {
                utils.handleMongooError(err, res);
            });
    });





module.exports = router;