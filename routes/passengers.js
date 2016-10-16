/** 
 * Express Route: /passengers
 * 
 * DISLAIMER: This file is written under the guidance of Hector Guo
 */

'use strict';

const express = require('express');
const router = express.Router();

const Passenger = require('../models/passenger');
const PayAccount = require('../models/paymentAccount');
const utils = require('../utils');
const ModelHandle = require('./factory');


const passengerHandle = new ModelHandle(Passenger, 'Passenger');
const accountHandle = new ModelHandle(PayAccount, 'Payment Account');

router.route('/passengers')
    /**
     * GET call for the passenger entity (multiple).
     * @returns {object} A list of passengers. (200 Status Code)
     * @throws Mongoose Database Error (500 Status Code)
     */
    .get((req, res) => {
        passengerHandle.get()
            .then((passengers) => {
                res.status(200).json(passengers);
            })
            .catch((err) => {
                utils.handleMongooError(err, res);
            });
    })
    /**
     * POST call for the passenger entity.
     * @param {string} license - The license plate of the new passenger
     * @returns {object} A message and the passenger created. (201 Status Code)
     * @throws Mongoose Database Error (500 Status Code)
     */
    .post((req, res) => {
        passengerHandle.create(req.body)
            .then((response) => {
                res.status(201).json(response);
            })
            .catch((err) => {
                utils.handleMongooError(err, res);
            });
    });

/** 
 * Express Route: /passengers/:passenger_id
 * @param {string} passenger_id - Id Hash of passenger Object
 */
router.route('/passengers/:passenger_id')
    /**
     * GET call for the passenger entity (single).
     * @returns {object} the passenger with Id passenger_id. (200 Status Code)
     * @throws Mongoose Database Error (500 Status Code)
     */
    .get(function (req, res) {
        passengerHandle.get(req.params.passenger_id)
            .then((passenger) => {
                res.status(200).json(passenger);
            })
            .catch((err) => {
                utils.handleMongooError(err, res);
            });
    })
    /**
     * PATCH call for the passenger entity (single).
     * @returns {object} A message and the passenger updated. (200 Status Code)
     * @throws Mongoose Database Error (500 Status Code)
     */
    .patch(function (req, res) {
        passengerHandle.update(req.params.passenger_id, req.body)
            .then((response) => {
                res.status(200).json(response);
            })
            .catch((err) => {
                utils.handleMongooError(err, res);
            });
    })
    /**
     * DELETE call for the passenger entity (single).
     * @returns {object} A string message. (200 Status Code)
     * @throws Mongoose Database Error (500 Status Code)
     */
    .delete(function (req, res) {
        passengerHandle.del(req.params.passenger_id)
            .then((response) => {
                res.json(response);
            })
            .catch((err) => {
                utils.handleMongooError(err, res);
            })
    });

router.route('/passengers/:passenger_id/paymentaccounts')
    .get((req, res) => {
        PayAccount.find({passenger_id: req.params.passenger_id}, (err, account) => {
            if(err) {
                utils.handleMongooError(err, res);
                return;
            }
            res.status(200).json(account);
        })
    })
    .post((req, res) => {
        if(!req.body.expirationDate) {
            utils.handleMongooError({
                kind: 'required',
                path: req.path,
                message: 'expirationDate required'
            }, res);
            return;
        }
        passengerHandle.get(req.params.passenger_id)
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