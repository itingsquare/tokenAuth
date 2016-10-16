/**
 * Express Route: /cars
 * 
 * DISLAIMER: This file is written under the guidance of Hector Guo
 */
var express = require('express');
var router = express.Router();

var Car = require('../app/models/car');
var utils = require('../app/utils');

const ModelHandle = require('./handler');

const carHandle = new ModelHandle(Car, 'Car');

router.route('/cars')
    /**
     * GET call for the car entity (multiple).
     * @returns {object} A list of cars. (200 Status Code)
     * @throws Mongoose Database Error (500 Status Code)
     */
    .get((req, res) => {
        carHandle.get()
            .then((cars) => {
                res.status(200).json(cars);
            })
            .catch((err) => {
                utils.handleMongooError(err, res);
            });
    })
    /**
     * POST call for the car entity.
     * @param {string} license - The license plate of the new car
     * @returns {object} A message and the car created. (201 Status Code)
     * @throws Mongoose Database Error (500 Status Code)
     */
     .post((req, res) => {
        carHandle.create(req.body)
            .then((response) => {
                res.status(201).json(response);
            })
            .catch((err) => {
                utils.handleMongooError(err, res);
            });
    });

/**
 * Express Route: /cars/:car_id
 * @param {string} car_id - Id Hash of Car Object
 */
router.route('/cars/:car_id')
    /**
     * GET call for the car entity (single).
     * @returns {object} the car with Id car_id. (200 Status Code)
     * @throws Mongoose Database Error (500 Status Code)
     */
     .get(function (req, res) {
        carHandle.get(req.params.car_id)
            .then((car) => {
                res.status(200).json(car);
            })
            .catch((err) => {
                utils.handleMongooError(err, res);
            });
    })
    /**
     * PATCH call for the car entity (single).
     * @returns {object} A message and the car updated. (200 Status Code)
     * @throws Mongoose Database Error (500 Status Code)
     */
      .patch(function (req, res) {
        carHandle.update(req.params.car_id, req.body)
            .then((response) => {
                res.status(200).json(response);
            })
            .catch((err) => {
                utils.handleMongooError(err, res);
            });
    })
    /**
     * DELETE call for the car entity (single).
     * @returns {object} A string message. (200 Status Code)
     * @throws Mongoose Database Error (500 Status Code)
     */
    .delete(function (req, res) {
        carHandle.del(req.params.car_id)
            .then((response) => {
                res.json(response);
            })
            .catch((err) => {
                utils.handleMongooError(err, res);
            })
    });
module.exports = router;
