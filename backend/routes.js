const express = require('express');
const nodemailer = require('nodemailer');
const conn = require('./db.js').conn;
const passwordUtils = require('./passwordUtils');
const dotenv = require('dotenv');

const router = express.Router();
dotenv.config({path: './config.env'});

router.post('/signup', async function(req, res){
    var sql = `SELECT * FROM visitorTable WHERE email = '${req.email}';`;
    const duplicateEmail = conn.query(sql, function(err, result){
                                if(err || !result) return {};
                                else return result[0];
                            });
    const {name, enrollmentNumber, email, password, contactNumber, address} = req.body;

    if(name && enrollmentNumber && email && password && contactNumber && address && !duplicateEmail){
        const saltHash = passwordUtils.generatePassword(password);
        const salt = saltHash.salt;
        const hash = saltHash.hash;
    
        sql = `INSERT INTO visitorTable (name, enrollmentnumber, email, password, contactnum, address, salt) VALUES 
            ('${name}', '${enrollmentNumber}', '${email}', '${hash}', '${contactNumber}', '${address}', '${salt}');`;
        conn.query(sql, function (err, result) {
            if(err) res.send({ registered: false });
            else res.send({ registered: true });
        });
    }
    else{
        res.send({ registered: true });
    }
});

router.post('/login', function(req, res, next){
    passport.authenticate('local', function(err, user){
        if(err){
            return next(err);
        }
        if(!user){
            return res.send({loginStatus: false});
        }
        req.logIn(user, function(err){
            if(err){
                return next(err);
            }
            return res.send({loginState: user.email});
        });
    })(req, res, next);
});

var transporter = nodemailer.createTransport({
    service: 'Yandex',
    auth: {
      user: process.env.ADMIN_MAIL,
      pass: process.env.ADMIN_PASS
    }
});

router.post('/contact', function(req, res){
    const {name, email, phone, message} = req.body;

    var mailOptions = {
        from: process.env.ADMIN_MAIL,
        to: 'vibhugarg507@gmail.com',
        subject: 'Contact Message',
        text: `Sender's Name: ${name}
               Sender's Email: ${email}
               Sender's Phone No.: ${phone}
               Message: ${message}.`
    };
      
    transporter.sendMail(mailOptions, function(err, info){
        if(err){
            res.send({status: 'fail'});
        }
        else{
            console.log('Email sent: ' + info.response);
            res.send({status: 'success'});
        }
    });
});

router.post('/scheduleVisit', function(req, res){
    const {secondPerson, duration, startTime, email} = req.body;
      
    var mailOptions = {
        from: process.env.ADMIN_MAIL,
        to: email,
        subject: 'Visitor Pass',
        text: `Meeting between ${req.name} and ${secondPerson}:
               VisitorID : ${Math.random().toString(36).substring(2, 12)}.
               Duration : ${duration} minutes.
               Time: ${startTime}.`
    };
      
    transporter.sendMail(mailOptions, function(err, info){
        if (err){
            res.send({ status : 'fail'});
        }
        else{
            console.log('Email sent: ' + info.response);
            res.send({ status : 'success'});
        }
    });
});

router.get('/isLoggedIn', (req, res) => {
    const isLoggedIn = req.isAuthenticated();
    res.send({isLoggedIn: isLoggedIn, user: req.user});
});

router.get('/logout', (req, res) => {
    req.logout();
    res.send({ logout: true });
});

module.exports = router;