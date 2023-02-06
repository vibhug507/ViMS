const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
const routes = require('./routes.js');

dotenv.config({path: './config.env'});

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

app.use(session({
    secret: process.env.SECRET_STRING,
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 7 * 1000 * 60 * 60 * 25
    }
}));

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
    console.log(req.session);
    console.log(req.user);
    next();
});

app.use('/signup', routes);
app.use('/login', routes);
app.use('/contact', routes);
app.use('/scheduleVisit', routes);
app.use('/logout', routes);
app.use('/isLoggedIn', routes);

app.listen(process.env.PORT, function(){
    console.log(`Server started on port ${process.env.PORT}.`);
});