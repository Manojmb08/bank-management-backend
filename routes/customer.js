let express = require('express');
let router = express.Router();
const mysql = require('mysql');
require('dotenv').config();

let connection = mysql.createConnection(process.env.LOCAL_DATABASE_URL);
connection.connect(function (err) {
    if (err) console.log(err);
    else console.log("Connected DB");
});

// Customer Register
router.post('/register', function (req, res) {
    let check_sql = `select applicant_email, account_number
                     from account
                     where applicant_email = '${req.body["customer_email"]}'
                       and account_number = '${req.body["acNo"]}' `;
    connection.query(check_sql, function (err, data) {
        const result = Object.values(JSON.parse(JSON.stringify(data)));
        result.forEach(r => console.log(r));

        if (result.length === 0) {
            res.json({
                success: false,
                message: "account or email does not match our records"
            })
        } else {
            let check_query = `select customer_email, account_no
                               from customer
                               where customer_email = '${req.body["customer_email"]}'
                                 and account_no = '${req.body["acNo"]}'`;
            connection.query(check_query, function (err, data) {
                const result = Object.values(JSON.parse(JSON.stringify(data)));
                console.log(result);
                // result.forEach(r => console.log(r));
                if (err) console.log(err);
                if (result.length !== 0) {
                    res.json({
                        success: false,
                        message: "email id already exists"
                    })
                } else {
                    let register_query = `insert into customer(customer_name, customer_email, customer_password, account_no)
                                          values ('${req.body["customer_name"]}', '${req.body["customer_email"]}',
                                                  '${req.body["customer_password"]}', '${req.body["acNo"]}')`;
                    connection.query(register_query, async function (err) {
                        if (err) console.log(err);
                        res.json({
                            success: true,
                            message: "Customer registered"
                        })
                    })
                }
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
    connection.query(check_sql, function (err, data) {
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


// Get account number
router.get('/', function (req, res) {
    let account_details_query = `select *
                                 from account
                                 where account_number = '${req.query["acno"]}'
                                   and applicant_email = '${req.query["email"]}'`;
    connection.query(account_details_query, function (err, data) {
        if (err) console.log(err);
        const result = Object.values(JSON.parse(JSON.stringify(data)));
        if (result.length === 0) {
            res.json({
                success: false,
                message: "Your account number and mail id does not match our records"
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
                                 order by transaction_id desc `;
    connection.query(account_details_query, function (err, data) {
        if (err) console.log(err);
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
    connection.query(check_account_num, function (err, data) {
        if (err) console.log(err);
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
            console.log(to_balance)
            let check_balance = `select applicant_balance
                                 from account
                                 where account_number = '${req.body["transacted_from"]}'`;
            connection.query(check_balance, function (err, data) {
                if (err) console.log(err);
                const bal = Object.values(JSON.parse(JSON.stringify(data)));
                let from_balance = bal[0]["applicant_balance"];
                // console.log(from_balance)
                // console.log(req.body["debit_amt"])
                // console.log(from_balance > req.body["debit_amt"])

                if (parseInt(from_balance) > parseInt(req.body["debit_amt"])) {
                    let insert_sql = `insert into transaction (transaction_date, transacted_to, transacted_from, debit_amt, balance)
                                      values ('${req.body["transaction_date"]}',
                                              '${req.body["transacted_to"]}',
                                              '${req.body["transacted_from"]}',
                                              '${req.body["debit_amt"]}',
                                              '${from_balance}' - '${req.body["debit_amt"]}')`;
                    connection.query(insert_sql, function (err) {
                        if (err) console.log(err);
                    })
                    let update_from_sql = `update account
                                           set applicant_balance=applicant_balance + '${req.body["debit_amt"]}'
                                           where account_number = '${req.body["transacted_to"]}' `;
                    connection.query(update_from_sql, function (err) {
                        if (err) console.log(err);
                    })
                    let update_from_sql2 = `update account
                                            set applicant_balance=applicant_balance - '${req.body["debit_amt"]}'
                                            where account_number = '${req.body["transacted_from"]}' `;
                    connection.query(update_from_sql2, function (err) {
                        if (err) console.log(err);
                    })
                    let insert_sql2 = `insert into transaction (transaction_date, transacted_to, transacted_from, credit_amt, balance)
                                       values ('${req.body["transaction_date"]}',
                                               '${req.body["transacted_from"]}',
                                               '${req.body["transacted_to"]}',
                                               '${req.body["debit_amt"]}',
                                               '${to_balance}' + '${req.body["debit_amt"]}')`;
                    connection.query(insert_sql2, function (err) {
                        if (err) console.log(err);
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