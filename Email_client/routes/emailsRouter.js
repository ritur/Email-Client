var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var EmailsSchema = require('../models/EmailsSchema.js');
var Create_DateVar = require('../models/Create_Date.js');

/* GET ALL BOOKS */
router.get('/', function (req, res, next) {
    EmailsSchema.find(function (err, products) {
        if (err) return next(err);
        res.json(products);
    });
});

/* GET SINGLE BOOK BY ID */
router.get('/:id', function (req, res, next) {
    EmailsSchema.findById(req.params.id, function (err, post) {
        if (err) return next(err);
        res.json(post);
    });
});

/* SAVE BOOK */
router.post('/', function (req, res, next) {
    const formData = req.body;
    const createDate = { create_Date: Create_DateVar.create_Date };
    const finalParams = { ...formData, ...createDate };
    console.log('group data are', finalParams);

    EmailsSchema.create(finalParams, function (err, post) {
        if (err) return next(err);
        res.json(post);
    });
});

/* UPDATE BOOK */
router.put('/:id', function (req, res, next) {
    EmailsSchema.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
        if (err) return next(err);
        res.json(post);
    });
});

/* DELETE BOOK */
router.delete('/:id', function (req, res, next) {
    EmailsSchema.findByIdAndRemove(req.params.id, req.body, function (err, post) {
        if (err) return next(err);
        res.json(post);
    });
});

module.exports = router;
