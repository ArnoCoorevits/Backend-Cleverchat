var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient
var url = "mongodb://localhost:27017/"
let Chatbots = mongoose.model('Chatbots')

router.get('/', function(req, res, next){
    Chatbots.find({}, function(err, ids){
        if (err) {
            throw err
        }
        res.send(ids)
    })
})

module.exports = router