let express = require('express');
let router = express.Router();
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

// Customer Register
router.post('/register', function (req, res) {
    let check_sql = `select customer_email
                     from customer
                     where customer_email = (?)`;
    let check_values = [
        req.body["email"]
    ];
    connection.query(check_sql, [check_values], function (err, data, fields) {
        if (err) throw err;
        console.log(data);
        console.log(fields);
        const result = Object.values(JSON.parse(JSON.stringify(data)));
        result.forEach((v) => console.log(v));
        if (result.length !== 0) {
            res.json({
                success: false,
                message: "Email already in use"
            })
        } else {
            let sql = `INSERT INTO customer(customer_name, customer_email, customer_password)
                       VALUES (?)`;
            let values = [
                req.body.name,
                req.body.email,
                req.body.password
            ];
            // console.log(sql);
            connection.query(sql, [values], function (err, data, fields) {
                if (err) throw err;
                res.json({
                    success: true,
                    message: "New customer added successfully"
                })
            })
        }

    })

});

// Customer login
router.post('/', function (req, res) {
    let check_sql = `select customer_email, customer_password
                     from customer
                     where customer_email = '${req.body["email"]}'
                       and customer_password = '${req.body["password"]}'`;
    connection.query(check_sql, function (err, data, fields) {
        if (err) throw err;
        console.log(data);
        console.log(fields);
        const result = Object.values(JSON.parse(JSON.stringify(data)));
        result.forEach((v) => console.log(v));
        if (result.length === 0) {
            res.json({
                success: false,
                message: "Check your email or password"
            })
        } else {
            res.json({
                success: true,
                message: "Logged in"
            })

        }

    })

});

// Get account number
// router.get('/?acno=10',getAcNo)

// Get transaction
// router.get('/trans?acno=10',getTrans)

// Send money
// router.post('/send/',sendMoney)

module.exports = router;