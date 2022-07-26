let knex = require('knex');

module.exports = knex({
    client: 'mysql', // pg, mssql, etc
    
    connection: {
        database:    'video',
        host:        '10.10.0.111',
        password:    'VegaIron2!',
        user:        'root',
        dateStrings: true,
        timezone: 'Asia/Seoul'
    }
});