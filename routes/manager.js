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

// Manager login
router.post('/', function (req, res) {
    let check_sql = `select manager_email, manager_password
                     from manager
                     where manager_email = '${req.body["email"]}'
                       and manager_password = '${req.body["password"]}'`;
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

// // Get Manager
// router.get('/?id=1',getManager)
//
// // Add Employee
// router.post('/addEmp/',addEmployee)
//
// // Get All Employee
// router.get('/getAllEmp',getAllEmployee)
//
// // update Employee
// router.put('/updateEmp?id=1',updateEmployee)
//
// // delete Employee
// router.delete('/delEmp?id=1',delEmployee)
//
// // Get All Customer
// router.get('/getAllCust',getAllCustomer)
//
// // Get Transaction
// router.get('/getTrans',getTrans)


module.exports = router;