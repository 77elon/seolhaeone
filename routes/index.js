"use strict";

var express = require('express');
var router = express.Router();

var moment = require('moment');
const hour = 3600000;
var now = moment(Date.now() + 9*hour).format('YYYY-MM-DD');

const crypto = require('crypto');

/* GET home page. */
router.get('/', function(req, res, next) {
    if (req.session.isLogined === true && req.session.author_id !== undefined){
        res.render('video', {username:  req.session.author_id});
    }
    else
    {
        res.render('index', {error: false});
    } 
});

const db = require("../database/connect/maria");

router.post('/login', function (req, res, next) {
    const secret = 'seolhaeone';
    const Password = crypto.createHmac('sha384', secret)
    .update(req.body.password)
    .digest('hex');
    
    db.getConnection(function(err, connection) {
        if (err) throw err; // not connected!
        
        connection.query('SELECT userName, ExpireDate FROM video.userinfo WHERE userinfo.userPassword=(?)', [req.body.password], function(err, result){
            if(err) throw err;
            console.log(req.body.password)
            if(result[0]!==undefined && result[0].ExpireDate >= now){
                console.log(result[0].ExpireDate)
                req.session.uid = result[0].Password;
                req.session.author_id = result[0].userName;
                req.session.isLogined = true;
                connection.release();
                if (err) throw err;
                //세션 스토어가 이루어진 후 redirect를 해야함.
                req.session.save(function(){
                    //res.render('video', {username: result[0].userName});
                    //router.replace('/');
                    res.redirect('/');
                });
            }
            else {
                res.render('index', {error: true});
            }
        });
    });
    
});

router.all('/logout', function (req, res, next) {
    if(req.session.isLogined){
        req.session.destroy(function(err){
            if(err) throw err;
        });
    }
    res.redirect('/');
});

module.exports = router;