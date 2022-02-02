const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const customerRouter = require('./routes/customer');
const managerRouter = require('./routes/manager');
const employeeRouter = require('./routes/employee');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/customer', customerRouter)
app.use('/manager', managerRouter)
app.use('/employee', employeeRouter)

module.exports = app;
