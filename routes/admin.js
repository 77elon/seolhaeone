"use strict";
var createError = require('http-errors');

var express = require('express');
var router = express.Router();

const crypto = require('crypto');

router.get('/', function(req, res, next) {
    console.log(req.session.a_isLogined);
    console.log(req.session.a_author_id);
    if (req.session.a_isLogined === true && req.session.a_author_id !== undefined){
        res.render('mgmt', {username:  req.session.a_author_id});
    }
    else
    {
        res.render('admin', {error: false});
    } 
});

const db = require("../database/connect/maria");

router.post('/login', function (req, res, next) {
    const secret = 'seolhaeone';
    
    const userID = req.body.userID;
    const Password = crypto.createHmac('sha384', secret)
    .update(req.body.password)
    .digest('hex');
    
    db.getConnection(function(err, connection) {
        if (err) throw err; // not connected!
        
        // db 생성 후, 관리자 db 접속
        connection.query('SELECT adminName, adminID FROM video.admininfo WHERE admininfo.adminID=(?) and admininfo.adminPassword=(?)', [userID, req.body.password], function(err, result){
            if(err) throw err;
            if(result[0]!==undefined){
                req.session.a_author_id = result[0].adminName;
                req.session.a_uid = result[0].adminID;
                req.session.a_isLogined = true;
                connection.release();
                if (err) throw err;
                //세션 스토어가 이루어진 후 redirect를 해야함.
                req.session.save(function(){
                    res.render('mgmt', {username: result[0].adminName});
                    //router.replace('/');
                    //res.redirect('/admin');
                });
            }
            else {
                res.render('admin', {error: true});
            }
        });
    });
});


router.get('/api/admin/readData', function(req, res, next) {
    var userList = [];
    //header_define(req, res, next);
    //console.log(req.session.a_isLogined);
    if (req.session.a_isLogined === false || req.session.a_isLogined === undefined){
        next(createError(404));
    } 
    else
    {
        db.getConnection(function(err, connection) {
            if (err) throw err; // not connected!
            
            connection.query('SELECT * FROM video.admininfo ORDER BY admininfo.adminName ASC', function(err, rows, fields) {
                if (err) {
                    next(createError(500));
                } 
                else {
                    //console.log(rows);
                    connection.release();
                    // Loop check on each row
                    for (var i = 0; i < rows.length; i++) {
                        var person = {
                            'rowNum':i+1,
                            'adminName':rows[i].adminName,
                            'adminID': rows[i].adminID,
                            'adminPassword':rows[i].adminPassword
                        }
                        userList.push(person);
                    }
                    if (err) throw err;
                    res.json({
                        result: true,
                        data: {
                            "contents": userList
                            // "pagination":
                            // {
                            //     "page": 1,
                            //     "totalCount": rows.length
                            // }
                        }
                    });
                    
                    //console.log(userList);
                }
            });
        });
        
    }
});


router.put('/api/admin/updateData', function(req, res, next) {
    var userList = [];
    
    //console.log(req.session.a_isLogined);
    if (req.session.a_isLogined === false || req.session.a_isLogined === undefined){
        next(createError(404));
    } 
    else
    {
        db.getConnection(function(err, connection) {
            if (err) throw err; // not connected!
            const rowData = req.body.rows;
            //console.log(req.body.rows);
            //console.log(rowData.length);
            connection.query('DELETE FROM video.admininfo');
            for (var i = 0; i < rowData.length; i++) {
                if (rowData.userName === '') continue;
                var person = {
                    'adminName':rowData[i].adminName,
                    'adminName': rowData[i].adminName,
                    'adminPassword':rowData[i].adminPassword
                }
                userList.push(person);
                console.log(person);
                connection.query('INSERT INTO video.admininfo VALUES (?, ?, ?)', [person.adminName, person.adminID, person.adminPassword], function(err, rows, fields){
                    if (err) {
                        next(createError(500));
                    } 
                    else {
                        //console.log(rows);
                        // Loop check on each row
                        if (err) throw err;
                    }
                });
            }
            connection.release();
            return res.send({
                result: true,
                data: {
                    "contents": userList
                }
            });
        });
    }
});


router.get('/api/user/readData', function(req, res, next) {
    var userList = [];
    //header_define(req, res, next);
    //console.log(req.session.a_isLogined);
    if (req.session.a_isLogined === false || req.session.a_isLogined === undefined){
        next(createError(404));
    } 
    else
    {
        db.getConnection(function(err, connection) {
            if (err) throw err; // not connected!
            
            connection.query('SELECT * FROM video.userinfo ORDER BY userinfo.userName ASC', function(err, rows, fields) {
                if (err) {
                    next(createError(500));
                } 
                else {
                    //console.log(rows);
                    connection.release();
                    // Loop check on each row
                    for (var i = 0; i < rows.length; i++) {
                        var person = {
                            'rowNum':i+1,
                            'userName':rows[i].userName,
                            'userPassword':rows[i].userPassword,
                            'ExpireDate':rows[i].ExpireDate,
                        }
                        userList.push(person);
                    }
                    if (err) throw err;
                    res.json({
                        result: true,
                        data: {
                            "contents": userList
                            // "pagination":
                            // {
                            //     "page": 1,
                            //     "totalCount": rows.length
                            // }
                        }
                    });
                    
                    //console.log(userList);
                }
            });
        });
        
    }
});


router.put('/api/user/updateData', function(req, res, next) {
    var userList = [];
    
    //console.log(req.session.a_isLogined);
    if (req.session.a_isLogined === false || req.session.a_isLogined === undefined){
        next(createError(404));
    } 
    else
    {
        db.getConnection(function(err, connection) {
            if (err) throw err; // not connected!
            const rowData = req.body.rows;
            //console.log(req.body.rows);
            //console.log(rowData.length);
            connection.query('DELETE FROM video.userinfo');
            for (var i = 0; i < rowData.length; i++) {
                if (rowData.userName === '') continue;
                var person = {
                    'userName':rowData[i].userName,
                    'userPassword':rowData[i].userPassword,
                    'ExpireDate':rowData[i].ExpireDate,
                }
                userList.push(person);
                console.log(person);
                connection.query('INSERT INTO video.userinfo VALUES (?, ?, ?)', [person.userName, person.userPassword, person.ExpireDate], function(err, rows, fields){
                    if (err) {
                        next(createError(500));
                    } 
                    else {
                        //console.log(rows);
                        // Loop check on each row
                        if (err) throw err;
                    }
                });
            }
            connection.release();
            return res.send({
                result: true,
                data: {
                    "contents": userList
                }
            });
        });
    }
});



router.all('/logout', function (req, res, next) {
    if(req.session.a_isLogined){
        req.session.destroy(function(err){
            if(err) throw err;
        });
    }
    res.redirect('/admin');
});


router.get('/user', function(req, res, next) {
    //console.log(req.session.a_isLogined);
    if (req.session.a_isLogined === false || req.session.a_isLogined === undefined){
        next(createError(404));
    } 
    else
    {
        res.render('userlist', {username: req.session.a_author_id});
    }
});


router.get('/adminlist', function(req, res, next) {
    //console.log(req.session.a_isLogined);
    if (req.session.a_isLogined === false || req.session.a_isLogined === undefined){
        next(createError(404));
    } 
    else
    {
        res.render('adminlist', {username: req.session.a_author_id});
    }
});


module.exports = router;