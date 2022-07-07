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


router.post('/login', function (req, res, next) {
  const db = require("../database/connect/maria");
  const secret = 'seolhaeone';
  
  const userID = req.body.userID;
  const Password = crypto.createHmac('sha384', secret)
  .update(req.body.password)
  .digest('hex');
  
  // db 생성 후, 관리자 db 접속
  db.query('SELECT adminName, adminID FROM video.admininfo WHERE admininfo.adminID=(?) and admininfo.adminPassword=(?)', [userID, Password], function(err, result){
    if(err) throw err;
    if(result[0]!==undefined){
      req.session.a_author_id = result[0].adminName;
      req.session.a_uid = result[0].adminID;
      req.session.a_isLogined = true;
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

router.get('/user', function(req, res, next) {
  var userList = [];
  const db = require("../database/connect/maria");
  //console.log(req.session.a_isLogined);
  if (req.session.a_isLogined === false || req.session.a_isLogined === undefined){
    next(createError(404));
  } 
  else
  {
    db.query('SELECT * FROM video.userinfo', function(err, rows, fields) {
      if (err) {
        next(createError(500));
      } 
      else {
        // Loop check on each row
        for (var i = 0; i < rows.length; i++) {
          var person = {
            'userName':rows[i].userName,
            'userPassword':rows[i].userPassword,
            'ExpireDate':rows[i].ExpireDate,
          }
          userList.push(person);
        }
        //console.log(userList);
        res.render('userlist', {userList: userList, username: req.session.a_author_id});
      }
    });
  }
});

module.exports = router;