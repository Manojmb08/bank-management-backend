let express = require('express');
let router = express.Router();

const mysql = require('mysql');

let options = {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '12345678',
    database: 'bank'
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


// // Add Employee
// router.post('/manager/addEmp/)
router.post('/addEmp', function (req, res) {
    let check_sql = `insert into employee(employee_email, employee_password, employee_name, employee_gender,
                                          employee_phone_no, employee_address)
                     VALUES ('${req.body["employee_email"]}',
                             '${req.body["employee_password"]}',
                             '${req.body["employee_name"]}',
                             '${req.body["employee_gender"]}',
                             '${req.body["employee_phone_no"]}',
                             '${req.body["employee_address"]}')`;
    connection.query(check_sql, function (err, data, fields) {
        if (err) throw err;

        res.json({
            success: true,
            message: "Successfully customer values added"
        })

    })

});


// // Get All Employee
// router.get('/getAllEmp',getAllEmployee)

router.get('/getAllEmp', function (req, res) {
    let check_sql = `select *
                     from employee`;
    connection.query(check_sql, function (err, data, fields) {
        if (err) throw err;
        // console.log(data);
        // console.log(fields);
        const result = Object.values(JSON.parse(JSON.stringify(data)));
        result.forEach((v) => console.log(v));
        // if (result.length === 0) {
        //     res.json({
        //         success: false,
        //         message: "Check your email or password"
        //     })
        // } else {
        res.json({
            success: true,
            message: "Employee list obtained",
            data: result
        })

        // }

    })

});


// // update Employee
// router.put('/updateEmp?id=1',updateEmployee)
//
router.put('/updateEmp', function (req, res) {
    let find_sql = `select *
                    from employee
                    where employee_id = '${req.query["id"]}'`;
    connection.query(find_sql, function (err, data, fields) {
        if (err) throw err;
        // console.log(data);
        // console.log(fields);
        const result = Object.values(JSON.parse(JSON.stringify(data)));
        result.forEach((v) => console.log(v));
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
            console.log(update_sql)
            connection.query(update_sql, function (err, data, fields) {
                if (err) throw err;
                // console.log(data);
                // console.log(fields);
                const result = Object.values(JSON.parse(JSON.stringify(data)));
                result.forEach((v) => console.log(v));
                res.json({
                    success: true,
                    message: "employee id is updated"
                })
            })
        }
    })
});


// // delete Employee
// router.delete('/delEmp?id=1',delEmployee)

router.delete('/delEmp', function (req, res) {
    let find_sql = `select *
                    from employee
                    where employee_id = '${req.query["id"]}'`;
    connection.query(find_sql, function (err, data, fields) {
        if (err) throw err;
        // console.log(data);
        // console.log(fields);
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
            connection.query(delete_sql, function (err, data, fields) {
                if (err) throw err;
                // console.log(data);
                // console.log(fields);
                const result = Object.values(JSON.parse(JSON.stringify(data)));
                result.forEach((v) => console.log(v));
                res.json({
                    success: true,
                    message: "employee id is deleted"
                })
            })
        }
    })
});


// // Get All Customer
// router.get('/getAllCust',getAllCustomer)

router.get('/getAllCust', function (req, res) {
    let check_sql = `select *
                     from customer`;
    connection.query(check_sql, function (err, data, fields) {
        if (err) throw err;
        // console.log(data);
        // console.log(fields);
        const result = Object.values(JSON.parse(JSON.stringify(data)));
        result.forEach((v) => console.log(v));
        // if (result.length === 0) {
        //     res.json({
        //         success: false,
        //         message: "Check your email or password"
        //     })
        // } else {
        res.json({
            success: true,
            message: "Customer list obtained",
            data: result
        })

        // }

    })

});


// // Get Transaction count
// router.get('/getTrans',getTrans)

router.get('/getTrans', function (req, res) {
    let check_sql = `select count(*) as total_tranaction
                     from transaction`;
    connection.query(check_sql, function (err, data, fields) {
        if (err) throw err;
        // console.log(data);
        // console.log(fields);
        const result = Object.values(JSON.parse(JSON.stringify(data)));
        result.forEach((v) => console.log(v));
        // if (result.length === 0) {
        //     res.json({
        //         success: false,
        //         message: "Check your email or password"
        //     })
        // } else {
        res.json({
            success: true,
            message: "Transaction count obtained",
            data: result
        })

        // }

    })

});


module.exports = router;