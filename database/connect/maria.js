const maria = require('mysql');
const conn = maria.createConnection({
    host:'10.0.1.193',
    port:3306,
    user:'root',
    password:'VegaIron2!',
    database:'video',
    timezone: 'Asia/Seoul'
});

module.exports = conn;