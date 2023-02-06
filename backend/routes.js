const express = require('express');
const nodemailer = require('nodemailer');
const conn = require('./db.js').conn;
const passwordUtils = require('./passwordUtils');

const router = express.Router();

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
      user: 'vibhugarg507@yandex.com',
      pass: 'helloseworldproject'
    }
});

router.post('/contact', function(req, res){

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

router.post('/scheduleVisit', function(req, res){
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

router.get('/isLoggedIn', (req, res) => {
    const isLoggedIn = req.isAuthenticated();
    res.send({isLoggedIn: isLoggedIn, user: req.user});
});

router.get('/logout', (req, res) => {
    req.logout();
    res.send({ logout: true });
});

module.exports = router;