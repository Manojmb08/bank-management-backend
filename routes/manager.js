let express = require('express');
let router = express.Router();
const mysql = require('mysql');
require('dotenv').config();

let connection = mysql.createConnection(process.env.DATABASE_URL);
connection.connect(function (err) {
    if (err) console.log(err);
    else console.log("Connected DB");
});

// Manager login
router.post('/', function (req, res) {
    let manager_login_query = `select *
                               from manager
                               where manager_email = '${req.body["email"]}'
                                 and manager_password = '${req.body["password"]}'`;
    connection.query(manager_login_query, function (err, data) {
        if (err) console.log(err);
        const result = Object.values(JSON.parse(JSON.stringify(data)));
        if (result.length === 0) {
            res.json({
                success: false,
                message: "Check your email or password"
            })
        } else {
            res.json({
                success: true,
                message: "Logged in",
                data: result[0]
            })
        }
    })
});


// Add Employee
router.post('/addEmp', function (req, res) {
    let check_sql = `select employee_email
                     from employee
                     where employee_email = '${req.body["employee_email"]}'`;
    connection.query(check_sql, function (err, data) {
        const result = Object.values(JSON.parse(JSON.stringify(data)));
        if (result.length !== 0) {
            res.json({
                success: false,
                message: "email id already exists"
            })
        } else {
            let insert_emp = `insert into employee(employee_email, employee_password, employee_name, employee_gender,
                                                   employee_phone_no, employee_address)
                              VALUES ('${req.body["employee_email"]}',
                                      '${req.body["employee_password"]}',
                                      '${req.body["employee_name"]}',
                                      '${req.body["employee_gender"]}',
                                      '${req.body["employee_phone_no"]}',
                                      '${req.body["employee_address"]}')`;
            connection.query(insert_emp, function (err) {
                if (err) console.log(err);

                res.json({
                    success: true,
                    message: "Successfully employee values added"
                })

            })
        }
    })
});


// Get All Employee
router.get('/getAllEmp', function (req, res) {
    let check_sql = `select *
                     from employee
                     order by employee_id desc `;
    connection.query(check_sql, function (err, data) {
        if (err) console.log(err);
        const result = Object.values(JSON.parse(JSON.stringify(data)));
        res.json({
            success: true,
            message: "Employee list obtained",
            data: result
        })
    })
});


// update Employee
router.put('/updateEmp', function (req, res) {
    let find_sql = `select *
                    from employee
                    where employee_id = '${req.query["id"]}'`;
    connection.query(find_sql, function (err, data) {
        if (err) console.log(err);
        const result = Object.values(JSON.parse(JSON.stringify(data)));
        if (result.length === 0) {
            res.json({
                success: false,
                message: "there is no such id"
            })
        } else {
            let update_sql = `update employee
                              set employee_email='${req.body["employee_email"]}',
                                  employee_password='${req.body["employee_password"]}',
                                  employee_name='${req.body["employee_name"]}',
                                  employee_gender='${req.body["employee_gender"]}',
                                  employee_phone_no='${req.body["employee_phone_no"]}',
                                  employee_address='${req.body["employee_address"]}'
                              where employee_id = '${req.query["id"]}' `;
            connection.query(update_sql, function (err) {
                if (err) console.log(err);
                res.json({
                    success: true,
                    message: "employee id is updated"
                })
            })
        }
    })
});


// delete Employee
router.delete('/delEmp', function (req, res) {
    let find_sql = `select *
                    from employee
                    where employee_id = '${req.query["id"]}'`;
    connection.query(find_sql, function (err, data) {
        if (err) console.log(err);
        const result = Object.values(JSON.parse(JSON.stringify(data)));
        result.forEach((v) => console.log(v));
        if (result.length === 0) {
            res.json({
                success: false,
                message: "there is no such id"
            })
        } else {
            let delete_sql = `delete
                              from employee
                              where employee_id = '${req.query["id"]}'`;
            console.log(delete_sql)
            connection.query(delete_sql, function (err) {
                if (err) console.log(err);
                res.json({
                    success: true,
                    message: "employee id is deleted"
                })
            })
        }
    })
});


// Get All Customer
router.get('/getAllCust', function (req, res) {
    let check_sql = `select *
                     from account`;
    connection.query(check_sql, function (err, data) {
        if (err) console.log(err);
        const result = Object.values(JSON.parse(JSON.stringify(data)));
        res.json({
            success: true,
            message: "Customer list obtained",
            data: result
        })
    })
});


// Get Transaction count
router.get('/getTransCount', function (req, res) {
    let check_sql = `select count(*) as total_transaction
                     from transaction`;
    connection.query(check_sql, function (err, data) {
        if (err) console.log(err);
        const result = Object.values(JSON.parse(JSON.stringify(data)));
        res.json({
            success: true,
            message: "Transaction count obtained",
            data: result[0]["total_transaction"]
        })
    })
});


// Get Customer count
router.get('/getCustCount', function (req, res) {
    let check_sql = `select count(*) as total_customer
                     from account`;
    connection.query(check_sql, function (err, data) {
        if (err) console.log(err);
        const result = Object.values(JSON.parse(JSON.stringify(data)));
        res.json({
            success: true,
            message: "Customer count obtained",
            data: result[0]["total_customer"]
        })
    })
});


// Get Employee count
router.get('/getEmpCount', function (req, res) {
    let check_sql = `select count(*) as total_employee
                     from employee`;
    connection.query(check_sql, function (err, data) {
        if (err) console.log(err);
        const result = Object.values(JSON.parse(JSON.stringify(data)));
        res.json({
            success: true,
            message: "Employee count obtained",
            data: result[0]["total_employee"]
        })
    })
});


module.exports = router;