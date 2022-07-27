const express = require('express');
const mysql = require('mysql');
const dotenv = require('dotenv');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');

dotenv.config({path: './config.env'});
const host = process.env.H;
const user = process.env.U;
const password = process.env.P;
const database = process.env.D;
const PORT = process.env.PORT;

const conn = mysql.createConnection({
    host: host,
    user: user,
    password: password,
    database: database
});

console.log(conn);

conn.connect(function(err){
    if(err) console.log("Error connecting to database.");
    else console.log("Connected to database");
});

const app = express();
app.use(express.json());
app.use(cors(
    {
        origin: ['http://localhost:3000'],
        methods: ['GET', 'POST'],
        credentials: true
    }
));

app.post('/signup', function(req, res){
    const {name, enrollmentNumber, email, password, contactNumber, address} = req.body;

    if(!name || !enrollmentNumber || !email || !password || !contactNumber || !address){
        return;
    }

    var sql = `INSERT INTO visitorTable (Name, EnrollmentNumber, Email, Password, ContactNum, Address) VALUES 
            ('${name}', '${enrollmentNumber}', '${email}', '${password}', '${contactNumber}', '${address}');`;
    conn.query(sql, function (err, result) {
        if(err) console.log(err);
        else console.log('Signup Successful');
    });
});

var isLoggedIn = false;
var loggedInUser = {
    name: "", enrollmentNumber: "", email: "", 
    password: "", contactNumber: "", address: ""
};

app.post('/login', function(req, res){
    const {email, password} = req.body;

    var sql = `SELECT * FROM visitorTable WHERE Email = '${email}' AND Password = '${password}';`;

    conn.query(sql, function (err, result) {
        if(err || !result || result[0].Password != password || isLoggedIn) {
            console.log('Login Unsuccessful.');
        }
        else {
            isLoggedIn = true;
            loggedInUser.email = result[0].Email;
            loggedInUser.password = result[0].Password;
            loggedInUser.name = result[0].Name;
            loggedInUser.contactNumber = result[0].ContactNum;
            loggedInUser.address = result[0].Address;
            loggedInUser.enrollmentNumber = result[0].EnrollmentNumber;
            console.log(loggedInUser);
            console.log('Login Successful');
        }
    });
});

app.get('/login', function(req, res){
    if(isLoggedIn){
        res.send({isLoggedIn, loggedInUser});
    }
    else{
        res.send({isLoggedIn, loggedInUser});
    }
});


var transporter = nodemailer.createTransport({
    service: 'Yandex',
    auth: {
      user: 'vibhugarg507@yandex.com',
      pass: 'helloseworldproject'
    }
});

app.post('/contact', function(req, res){

    const {name, email, phone, message} = req.body;

    var mailOptions = {
        from: 'vibhugarg507@yandex.com',
        to: email,
        subject: 'Contact Message',
        text: `Sender's Name: ${name}
               Sender's Email: ${email}
               Sender's Phone No.: ${phone}
               Message: ${message}.`
    };
      
    transporter.sendMail(mailOptions, function(err, info){
        if (err){
            console.log(err);
        }
        else{
            console.log('Email sent: ' + info.response);
        }
    });


});

var id = 1;

app.post('/scheduleVisit', function(req, res){
    const {secondPerson, duration, StartTime, email} = req.body;
      
    var mailOptions = {
        from: 'vibhugarg507@yandex.com',
        to: email,
        subject: 'Visitor Pass',
        text: `VisitorID : ${id}.`
    };
      
    transporter.sendMail(mailOptions, function(err, info){
        if (err){
            console.log(err);
        }
        else{
            console.log('Email sent: ' + info.response);
        }
    });

    id += 1;
});

app.post('/logout', function(req, res){
    isLoggedIn = false;
    loggedInUser.name = "";
    loggedInUser.enrollmentNumber = "";
    loggedInUser.email = "";
    loggedInUser.password = "";
    loggedInUser.contactNumber = "";
    loggedInUser.address = "";
});


app.listen(PORT, function(){
    console.log(`Server started on port ${PORT}.`);
});