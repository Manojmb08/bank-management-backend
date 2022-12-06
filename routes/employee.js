let express = require('express');
let router = express.Router();
const mysql = require('mysql');
require('dotenv').config();

let connection = mysql.createConnection(process.env.LOCAL_DATABASE_URL);
connection.connect(function (err) {
    if (err) console.log(err);
    else console.log("Connected DB");
});

// Employee login
router.post('/', function (req, res) {
    let employee_login_query = `select *
                                from employee
                                where employee_email = '${req.body["email"]}'
                                  and employee_password = '${req.body["password"]}'`;
    connection.query(employee_login_query, function (err, data) {
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


// Get Employee
router.get('/', function (req, res) {
    let check_sql = `select *
                     from employee
                     where employee_id = '${req.query["id"]}'
                       and employee_email = '${req.query["email"]}'`;
    connection.query(check_sql, function (err, data) {
        if (err) console.log(err);
        const result = Object.values(JSON.parse(JSON.stringify(data)));
        if (result.length === 0) {
            res.json({
                success: false,
                message: "id mismatch with your email"
            })
        } else {
            res.json({
                success: true,
                message: "employee id is present",
                data: result
            })
        }
    })
});


// Add Customer
router.post('/addCust', function (req, res) {
    let check_sql = `select applicant_email
                     from account
                     where applicant_email = '${req.body["applicant_email"]}'`;
    connection.query(check_sql, function (err, data) {
        const result = Object.values(JSON.parse(JSON.stringify(data)));
        if (result.length !== 0) {
            res.json({
                success: false,
                message: "email id already exists"
            })
        } else {
            let check_sql = `insert into account(account_number, account_type, branch, ifsc, applicant_name,
                                                 applicant_phone_no, applicant_dob, applicant_email, applicant_address,
                                                 applicant_gender, applicant_balance)
                             VALUES ('${req.body["account_number"]}',
                                     '${req.body["account_type"]}',
                                     '${req.body["branch"]}',
                                     '${req.body["ifsc"]}',
                                     '${req.body["applicant_name"]}',
                                     '${req.body["applicant_phone_no"]}',
                                     '${req.body["applicant_dob"]}',
                                     '${req.body["applicant_email"]}',
                                     '${req.body["applicant_address"]}',
                                     '${req.body["applicant_gender"]}',
                                     '${req.body["applicant_balance"]}')`;
            connection.query(check_sql, function (err) {
                if (err) console.log(err);
                res.json({
                    success: true,
                    message: "Successfully customer values added"
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


// update customer
router.put('/updateCust', function (req, res) {
    let find_sql = `select *
                    from account
                    where account_id = '${req.query["id"]}'`;
    connection.query(find_sql, function (err, data) {
        if (err) console.log(err);
        const result = Object.values(JSON.parse(JSON.stringify(data)));
        if (result.length === 0) {
            res.json({
                success: false,
                message: "there is no such id"
            })
        } else {
            let update_sql = `update account
                              set account_number='${req.body["account_number"]}',
                                  account_type='${req.body["account_type"]}',
                                  branch='${req.body["branch"]}',
                                  ifsc='${req.body["ifsc"]}',
                                  applicant_name='${req.body["applicant_name"]}',
                                  applicant_phone_no='${req.body["applicant_phone_no"]}',
                                  applicant_dob='${req.body["applicant_dob"]}',
                                  applicant_email='${req.body["applicant_email"]}',
                                  applicant_address='${req.body["applicant_address"]}',
                                  applicant_gender='${req.body["applicant_gender"]}',
                                  applicant_balance='${req.body["applicant_balance"]}'
                              where account_id = '${req.query["id"]}' `;
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


// delete customer
router.delete('/delCust', function (req, res) {
    let find_sql = `select *
                    from account
                    where account_id = '${req.query["id"]}'`;
    connection.query(find_sql, function (err, data) {
        if (err) console.log(err);
        const result = Object.values(JSON.parse(JSON.stringify(data)));
        if (result.length === 0) {
            res.json({
                success: false,
                message: "there is no such id"
            })
        } else {
            let delete_sql = `delete
                              from account
                              where account_id = '${req.query["id"]}'`;
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


module.exports = router;