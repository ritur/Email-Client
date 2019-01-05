var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var GroupSchemas = require('../models/GroupSchema.js');
var Create_DateVar = require('../models/Create_Date.js');

/* GET ALL BOOKS */
router.get('/', function (req, res, next) {
    GroupSchemas.find(function (err, products) {
        if (err) return next(err);
        res.json(products);
    });
});

/* GET ALL BOOKS */
router.get('/getSelectedGroupFields', function (req, res, next) {
    console.log('getSelectedGroupFields api called')
    GroupSchemas.find({}, { receive_mail_type: 1, email_id: 1, groupMembers: 1, _id: 0 }, function (err, products) {
        if (err) return next(err);
        res.json(products);
    });
});

/* GET SINGLE BOOK BY ID */
router.get('/:id', function (req, res, next) {
    GroupSchemas.findById(req.params.id, function (err, post) {
        if (err) return next(err);
        res.json(post);
    });
});

/* SAVE BOOK */
router.post('/', function (req, res, next) {
    const formData = req.body;
    const createDate = { create_Date: Create_DateVar.create_Date };
    const finalParams = { ...formData, ...createDate };
    console.log('group data are',finalParams);

    GroupSchemas.create(finalParams, function (err, post) {
        if (err) return next(err);
        res.json(post);
    });
});

/* UPDATE BOOK */
router.put('/:id', function (req, res, next) {
    GroupSchemas.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
        if (err) return next(err);
        res.json(post);
    });
});

/* DELETE BOOK */
router.delete('/:id', function (req, res, next) {
    GroupSchemas.findByIdAndRemove(req.params.id, req.body, function (err, post) {
        if (err) return next(err);
        res.json(post);
    });
});

module.exports = router;
