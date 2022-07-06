"use strict";

var express = require('express');
var router = express.Router();

const crypto = require('crypto');

router.get('/', function(req, res, next) {
  res.render('admin', {error: false});
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
      req.session.author_id = result[0].adminName;
      req.session.uid = result[0].adminID;
      req.session.AdminisLogined = true;
      //세션 스토어가 이루어진 후 redirect를 해야함.
      req.session.save(function(){
        res.render('mgmt', {username: result[0].adminName});
        //router.replace('/');
      });
    }
    else {
      res.render('admin', {error: true});
    }
  });
});

router.post('/user', function(req, res) {
  var userList = [];
  
  db.query('SELECT * FROM video.userinfo', function(err, rows, fields) {
    if (err) {
      res.status(500).json({"status_code": 500,"status_message": "internal server error"});
    } else {
      // Loop check on each row
      for (var i = 0; i < rows.length; i++) {
        var person = {
          '사용자 이름':rows[i].userName,
          '접속 비밀번호':rows[i].userPassword,
          '만료 날짜':rows[i].ExpireDate,
        }
        userList.push(person);
      }
      // Render index.pug page using array 
      res.render('userlist', {"userlist": userList});
    }
  });
  
  // Close the MySQL connection
  db.end();
  
});

router.post('/user/:id', function(req, res) {
  // Connect to MySQL database.
  
  // Do the query to get data.
  db.query('SELECT * FROM video.userinfo WHERE userName = ' + req.params.uid, function(err, rows, fields) {
    var user;
    
    if (err) {
      res.status(500).json({"status_code": 500,"status_message": "internal server error"});
    } else {
      // Check if the result is found or not
      if(rows.length==1) {
        // Create the object to save the data.
        var user = {
          '사용자 이름':rows[i].userName,
          '접속 비밀번호':rows[i].userPassword,
          '만료 날짜':rows[i].ExpireDate,
        }
        // render the details.plug page.
        res.render('userlist', {"user": user});
      } else {
        // render not found page
        res.status(404).json({"status_code":404, "status_message": "User Not found"});
      }
    }
  });
  
  // Close MySQL connection
  db.end();
});

module.exports = router;