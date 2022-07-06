const express = require('express');
const bcrypt = require('bcryptjs');
const mysql = require('mysql');
const dotenv = require('dotenv');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');

const router = express.Router();

dotenv.config({path: './config.env'});
const host = process.env.H;
const user = process.env.U;
const password = process.env.P;
const database = process.env.D;

const conn = mysql.createConnection({
    host: host,
    user: user,
    password: password,
    database: database
});

conn.connect(function(err){
    if(err) console.log('Error connecting to database.');
    else console.log('Connected to database');
});

// Form validation to be done
router.post('/signup', function(req, res){
    console.log(req);
    const {name, enrollmentNumber, email, password, contactNumber, address} = req.body;

    password = bcrypt.hash(password, 12);

    var sql = `INSERT INTO visitorTable (Name, EnrollmentNumber, Email, Password, ContactNum, Address) VALUES 
            ('${name}', '${enrollmentNumber}', '${email}', '${password}', '${contactNumber}', '${address}');`;
    conn.query(sql, function (err, result) {
        if(err) console.log('Signup Unsuccessful.');
        else console.log('Signup Successful');
    });
});

// Form validation to be done
router.post('/login', function(req, res){
    const {email, password} = req.body;

    var sql = `SELECT * FROM visitorTable WHERE Email = '${email}' AND Password = '${password}';`;
    var sql2 = "SELECT PASSWORD FROM visitorTable WHERE Email = '" + email + ";";

    conn.query(sql2, function (err, result) {
        if(err || !bcrypt.compare(result[0].Password, password)) console.log('Login Unsuccessful.');
        else console.log('Login Successful');
    });


    conn.query(sql, function (err, result) {
        if(err) console.log('Login Unsuccessful.');
        else console.log('Login Successful');
    });
});


router.post('/changePass', function(req, res){
    const {password, email} = req.body;

    var sql = `UPDATE visitorTable SET Password = '${password}' WHERE Email = '${email}';`;

    conn.query(sql, function (err, result) {
        if(err) console.log('Password could not be changed.');
        else console.log('Password changed successfully.');
    });
});

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'iit2020028@iiita.ac.in',
      pass: 'seproject'
    }
});

var id = 1;

router.post('/scheduleVisit', function(req, res){
    const {secondPerson, duration, StartTime, email} = req.body;
      
    var mailOptions = {
        from: 'iit2020028@iiita.ac.in',
        to: email,
        subject: 'Visitor Pass',
        text: `VisitorID : ${id}.`
    };
      
    transporter.sendMail(mailOptions, function(err, info){
        if (err) console.log(err);
        else console.log('Email sent: ' + info.response);
    });

    id += 1;
});

router.post('/updateDetails', function(req, res){
    const {name, enrollmentNumber, email, password, contactNumber, address, prevEmail} = req.body;

    password = bcrypt.hash(password, 12);

    var sql = `UPDATE visitorTable SET Name = '${name}', EnrollmentNumber = '${enrollmentNumber}', Email = '${email}', 
               Password = '${password}', ContactNum = '${contactNumber}', Address = '${address}' WHERE Email = ${prevEmail};`;
    conn.query(sql, function (err, result) {
        if(err) console.log('Details could not be updated.');
        else console.log('Details updated successfully.');
    });
});

module.exports = router;