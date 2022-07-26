const maria = require('mysql');
const conn = maria.createPool({
    host:'10.10.0.111',
    port:3306,
    user:'root',
    password:'VegaIron2!',
    database:'video',
    timezone: 'Asia/Seoul'
});

module.exports = conn;