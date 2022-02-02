const mysql = require('mysql');

let options = {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '12345678',
    database: 'test'
};

let connection = mysql.createConnection(options);
connection.connect(function (err) {
    if (err) throw err;
    else console.log("Connected DB");
});
