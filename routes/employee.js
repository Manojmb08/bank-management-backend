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

// Employee login
router.post('/', function (req, res) {
    let check_sql = `select employee_email, employee_password
                     from employee
                     where employee_email = '${req.body["email"]}'
                       and employee_password = '${req.body["password"]}'`;
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

// // Get Employee
// router.get('/?id=1',getEmployee)
//
// // Add Customer
// router.post('/addCust/',addCustomer)
//
// // Get All Customer
// router.get('/getAllCust',getAllCustomer)
//
// // update customer
// router.put('/updateCust?id=1',updateCustomer)
//
// // delete customer
// router.delete('/delCust?id=1',delCustomer)

module.exports = router;