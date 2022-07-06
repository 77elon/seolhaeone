"use strict";

var login = async function (username, hashedpassword) {
    //console.log(hashedpassword)
    const mariadb = require("mariadb");
    let conn;
    try {
        conn = await mariadb.createConnection({
            host: '10.0.1.193',
            port: 3306,
            user: 'root',
            password: 'VegaIron2!',
            database: 'video',
            timezone: 'Asia/Seoul'
        });
        var rows = await conn.query('SELECT userName FROM userinfo WHERE userinfo.userPassword=(?)', [hashedpassword]);
        if (rows === undefined) {
            return false;
        }
        else {
            //console.log("query: " + rows);
            return rows[0].userName;
        }
    } catch (err) {
        // Manage Errors
        console.log(err);
    } finally {
        // Close Connection
        if (conn) await (conn).end();
    }
}

module.exports = login;