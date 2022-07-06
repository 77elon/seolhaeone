"use strict";

var express = require('express');
var router = express.Router();

var moment = require('moment');
var now = moment(Date.now()).format('YYYY-MM-DD');

const crypto = require('crypto');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { error: false });
});

router.post('/login', function (req, res, next) {
  const db = require("../database/connect/maria");
  const secret = 'seolhaeone';
  const Password = crypto.createHmac('sha384', secret)
  .update(req.body.password)
  .digest('hex');
  
  db.query('SELECT userName, ExpireDate FROM video.userinfo WHERE userinfo.userPassword=(?)', [Password], function(err, result){
    if(err) throw err;
    //console.log(result[0].ExpireDate)
    //console.log(pass)
    if(result[0]!==undefined && result[0].ExpireDate >= now){
      req.session.uid = result[0].Password;
      req.session.author_id = result[0].userName;
      req.session.isLogined = true;
      //세션 스토어가 이루어진 후 redirect를 해야함.
      req.session.save(function(){
        res.render('video', {username: result[0].userName});
        //router.replace('/');
      });
    }
    else {
      res.render('index', {error: true});
    }
  });
});


/* router.get('/select', function(req, res) {
  maria.query('SELECT userName FROM userinfo where userPassword=? ','randompw', function(err, rows, fields) {
    if(!err) {
      //console.log(rows);
      //console.log(rows[0].userName);
      res.send(rows); // responses send rows
    } else {
      console.log("err : " + err);
      res.send(err);  // response send err
    }
  });
});
*/
module.exports = router;