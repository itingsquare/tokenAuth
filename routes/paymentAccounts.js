/*DISLAIMER: This file is written under the guidance of Hector Guo*/

'use strict';

const express = require('express');
const router = express.Router();

const PayAccount = require('../models/paymentAccount');
const utils = require('../utils');
const ModelHandle = require('./factory');


const accountHandle = new ModelHandle(PayAccount, 'Payment Account');


router.route('/paymentaccounts')
    /**
     * GET call for the account entity (multiple).
     * @returns {object} A list of paymentaccounts. (200 Status Code)
     * @throws Mongoose Database Error
     */
    .get((req, res) => {
        accountHandle.get()
            .then((paymentaccounts) => {
                res.status(200).json(paymentaccounts);
            })
            .catch((err) => {
                utils.handleMongooError(err, res);
            });
    })
    /**
     * POST call for the account entity.
     * @param {string} license - The license plate of the new account
     * @returns {object} A message and the account created. (201 Status Code)
     * @throws Mongoose Database Error
     */
    .post((req, res) => {
        accountHandle.create(req.body)
            .then((response) => {
                res.status(201).json(response);
            })
            .catch((err) => {
                utils.handleMongooError(err, res);
            });
    });

/** 
 * Express Route: /paymentaccounts/:account_id
 * @param {string} account_id - Id Hash of account Object
 */
router.route('/paymentaccounts/:account_id')
    /**
     * GET call for the account entity (single).
     * @returns {object} the account with Id account_id. (200 Status Code)
     * @throws Mongoose Database Error
     */
    .get(function (req, res) {
        accountHandle.get(req.params.account_id)
            .then((account) => {
                res.status(200).json(account);
            })
            .catch((err) => {
                utils.handleMongooError(err, res);
            });
    })
    /**
     * PATCH call for the account entity (single).
     * @returns {object} A message and the account updated. (200 Status Code)
     * @throws Mongoose Database Error
     */
    .patch(function (req, res) {
        accountHandle.update(req.params.account_id, req.body)
            .then((response) => {
                res.status(200).json(response);
            })
            .catch((err) => {
                utils.handleMongooError(err, res);
            });
    })
    /**
     * DELETE call for the account entity (single).
     * @returns {object} A string message. (200 Status Code)
     * @throws Mongoose Database Error
     */
    .delete(function (req, res) {
        accountHandle.del(req.params.account_id)
            .then((response) => {
                res.json(response);
            })
            .catch((err) => {
                utils.handleMongooError(err, res);
            })
    });

module.exports = router;