var session = require('express-session');          
var MySQLStore = require('express-mysql-session')(session);  
var options ={
    host: '10.10.0.111',
    port: 3306,
    user: 'root',
    password: 'VegaIron2!',
    database: 'session'
};
var sessionStore = new MySQLStore(options);   

const hour = 3600000;

module.exports = session({                               
    key: "seolhaeone",
    secret: "e0cac8a6b18e1f6b3e082c7aef2da6ce6bef674db00893223f5640a158d676a36153fc269c0aee6399d623bdf4ba9356",
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie:{ expires : new Date(Date.now() + 9*hour + 1/2*hour)}                            
});

