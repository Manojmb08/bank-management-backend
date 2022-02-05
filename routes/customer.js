let express = require('express');
let router = express.Router();
const mysql = require('mysql');

// let options = {
//     host: 'localhost',
//     port: 3306,
//     user: 'root',
//     password: '12345678',
//     database: 'bank'
// };

let options = {
    host: 'blqcpn8e5iyd5bviqdle-mysql.services.clever-cloud.com',
    port: 3306,
    user: 'uezigxwwgajw9w7y',
    password: 'OsN0RoQKOV1YNx7GSZGF',
    database: 'blqcpn8e5iyd5bviqdle'
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
                     where customer_email = '${req.body["customer_email"]}'`;
    connection.query(check_sql, function (err, data, fields) {
        const result = Object.values(JSON.parse(JSON.stringify(data)));
        if (result.length !== 0) {
            res.json({
                success: false,
                message: "email id already exists"
            })
        } else {
            let register_query = `insert into customer(customer_name, customer_email, customer_password)
                                  values ('${req.body["customer_name"]}', '${req.body["customer_email"]}', '${req.body["customer_password"]}')`;
            connection.query(register_query, function (err, data, fields) {
                if (err) throw err;
            })

            let registe_query = `select *
                                 from customer
                                 where customer_email = '${req.body["customer_email"]}'`;
            connection.query(registe_query, function (err, data, fields) {
                const result = Object.values(JSON.parse(JSON.stringify(data)));
                if (err) throw err;
                res.json({
                    success: true,
                    message: "Customer registered",
                    data: result[0]
                })
            })

        }
    })
});


// Customer login
router.post('/', function (req, res) {
    let check_sql = `select *
                     from customer
                     where customer_email = '${req.body["email"]}'
                       and customer_password = '${req.body["password"]}'`;
    connection.query(check_sql, function (err, data, fields) {
        if (err) throw err;
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


// Get account number
router.get('/', function (req, res) {
    let account_details_query = `select *
                                 from account
                                 where account_number = '${req.query["acno"]}'`;
    connection.query(account_details_query, function (err, data, fields) {
        if (err) throw err;
        const result = Object.values(JSON.parse(JSON.stringify(data)));
        if (result.length === 0) {
            res.json({
                success: false,
                message: "please check account number"
            })
        } else {

            res.json({
                success: true,
                message: "Customer details obtained",
                data: result[0]
            })
        }
    })
});


// Get transaction
router.get('/trans', function (req, res) {
    let account_details_query = `select *
                                 from transaction
                                 where transacted_from = '${req.query["acno"]}'
                                 union
                                 select *
                                 from transaction
                                 where transacted_to = '${req.query["acno"]}'
                                 order by transaction_date desc `;
    connection.query(account_details_query, function (err, data, fields) {
        if (err) throw err;
        const result = Object.values(JSON.parse(JSON.stringify(data)));

        if (result.length === 0) {
            res.json({
                success: false,
                message: "No transaction"
            })
        } else {

            res.json({
                success: true,
                message: "Customer transaction details obtained",
                data: result
            })
        }
    })
});


// Send money
router.post('/send', function (req, res) {
    let check_account_num = `select *
                             from account
                             where account_number = '${req.body["transacted_to"]}'`;
    connection.query(check_account_num, function (err, data, fields) {
        if (err) throw err;
        const result = Object.values(JSON.parse(JSON.stringify(data)));
        result.forEach(r => console.log(r));
        // if there is ac no
        if (result.length === 0) {
            res.json({
                success: false,
                message: "Enter valid account"
            })
        }

        // if ac no exists
        else {
            let to_balance = result[0]["applicant_balance"];
            let check_balance = `select applicant_balance
                                 from account
                                 where account_number = '${req.body["transacted_from"]}'`;
            connection.query(check_balance, function (err, data, fields) {
                if (err) throw err;
                const bal = Object.values(JSON.parse(JSON.stringify(data)));
                let from_balance = bal[0]["applicant_balance"];
                // hfhf
                if (from_balance > req.body["debit_amt"]) {
                    let insert_sql = `insert into transaction (transaction_date, transacted_to, transacted_from, debit_amt, balance)
                                      values ('${req.body["transaction_date"]}',
                                              '${req.body["transacted_to"]}',
                                              '${req.body["transacted_from"]}',
                                              '${req.body["debit_amt"]}',
                                              '${from_balance}' - '${req.body["debit_amt"]}')`;
                    connection.query(insert_sql, function (err, data, fields) {
                        if (err) throw err;
                    })
                    let update_from_sql = `update account
                                           set applicant_balance=applicant_balance + '${req.body["debit_amt"]}'
                                           where account_number = '${req.body["transacted_to"]}' `;
                    connection.query(update_from_sql, function (err, data, fields) {
                        if (err) throw err;
                    })
                    let update_from_sql2 = `update account
                                            set applicant_balance=applicant_balance - '${req.body["debit_amt"]}'
                                            where account_number = '${req.body["transacted_from"]}' `;
                    connection.query(update_from_sql2, function (err, data, fields) {
                        if (err) throw err;
                    })
                    let insert_sql2 = `insert into transaction (transaction_date, transacted_to, transacted_from, credit_amt, balance)
                                       values ('${req.body["transaction_date"]}',
                                               '${req.body["transacted_from"]}',
                                               '${req.body["transacted_to"]}',
                                               '${req.body["debit_amt"]}',
                                               '${to_balance}' + '${req.body["debit_amt"]}')`;
                    connection.query(insert_sql2, function (err, data, fields) {
                        if (err) throw err;
                    })
                    res.json({
                        success: true,
                        message: "money sent"
                    })
                }
                // insufficient balance
                else {
                    res.json({
                        success: false,
                        message: "debit amt greater than balance"
                    })
                }
            })
        }
    })
});

module.exports = router;