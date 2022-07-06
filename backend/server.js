const express = require('express');
const mysql = require('mysql');
const dotenv = require('dotenv');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
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
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));
app.use(session({
    key: "userId",
    secret: "helloworld",
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 60 * 60 * 24
    }
}))

// Form validation to be done
app.post('/signup', function(req, res){
    const {name, enrollmentNumber, email, password, contactNumber, address} = req.body;

    var sql = `INSERT INTO visitorTable (Name, EnrollmentNumber, Email, Password, ContactNum, Address) VALUES 
            ('${name}', '${enrollmentNumber}', '${email}', '${password}', '${contactNumber}', '${address}');`;
    conn.query(sql, function (err, result) {
        if(err) console.log(err);
        else console.log('Signup Successful');
    });
});

// Form validation to be done
app.post('/login', function(req, res){
    const {email, password} = req.body;

    var sql = `SELECT * FROM visitorTable WHERE Email = '${email}' AND Password = '${password}';`;

    conn.query(sql, function (err, result) {
        if(err || !result || result[0].Password != password) {
            console.log('Login Unsuccessful.');
        }
        else {
            req.session.user = result;
            console.log(req.session.user);
            console.log('Login Successful');
        }
    });
});

app.get('/login', function(req, res){
    if(req.session.user){
        console.log('hi1');
        res.send({loggedIn: true, user: req.session.user});
    }
    else{
        console.log('hi2');
        res.send({loggedIn: false});
    }
});


// Admin email: vibhugarg507@gmail.com
// Team email: iit2020028@iiita.ac.in
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'iit2020028@iiita.ac.in',
      pass: 'seproject'
    }
});

app.post('/contact', function(req, res){

    const {name, email, phone, message} = req.body;

    var mailOptions = {
        from: 'iit2020028@iiita.ac.in',
        to: 'vibhugarg507@gmail.com',
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
        from: 'iit2020028@iiita.ac.in',
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


app.listen(PORT, function(){
    console.log(`Server started on port ${PORT}.`);
});