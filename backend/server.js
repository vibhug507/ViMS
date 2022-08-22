const express = require('express');
const mysql = require('mysql');
const dotenv = require('dotenv');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
const localStrategy = require('passport-local');
const bcrypt = require('bcryptjs');

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
app.use(bodyParser.urlencoded({extended: true}));

// app.use(session({
//     secret: 'secret key',
//     resave: false,
//     saveUninitialized: true
// }));

// app.use(passport.initialize());
// app.use(passport.session());

app.post('/signup', function(req, res){
    const {name, enrollmentNumber, email, password, contactNumber, address} = req.body;

    if(!name || !enrollmentNumber || !email || !password || !contactNumber || !address){
        return;
    }

    bcrypt.hash(password, 12).then(function(pass){
        var sql = `INSERT INTO visitorTable (Name, EnrollmentNumber, Email, Password, ContactNum, Address) VALUES 
        ('${name}', '${enrollmentNumber}', '${email}', '${pass}', '${contactNumber}', '${address}');`;
        conn.query(sql, function (err, result) {
            if(err) console.log(err);
            else console.log('Signup Successful');
        });
        return;
    });

});

var isLoggedIn = false;
var loggedInUser = {
    name: "", enrollmentNumber: "", email: "", 
    password: "", contactNumber: "", address: ""
};

app.post('/login', function(req, res){
    const {email, password} = req.body;

    if(!email || !password){
        return;
    }

    var sql = `SELECT Password FROM visitorTable WHERE Email = '${email}';`;

    conn.query(sql, function(err, result){
        if(err) console.log('Login Unsuccessful.');
        else{
            bcrypt.compare(password, result[0].Password).then(function(value){
                if(value){
                    var sql2 = `SELECT * FROM visitorTable WHERE Email = '${email}';`;
                    conn.query(sql2, function (err, result) {
                        if(err){
                            console.log('Login Unsuccessful.');
                        }
                        else{
                            isLoggedIn = true;
                            loggedInUser = result[0];
                            console.log(loggedInUser);
                            console.log('Login Successful');
                        }
                    });
                }
                else console.log('Invalid Password.');
            });
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