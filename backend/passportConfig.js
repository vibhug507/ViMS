const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const conn = require('./db.js').conn;
const passwordUtils = require('./passwordUtils');

const customFields = {
    usernameField: "userEmail",
    passwordField: "userPassword",
};

const verify = async (email, password, done) => {
    var sql = `SELECT * FROM visitorTable WHERE email = '${email}';`;
    const user = conn.query(sql, function (err, result) {
        if(err || !result) return {};
        else return result[0];
    });
    if (!user) {
        return done(null, false);
    }
    const isValid = passwordUtils.validatePassword(
        password,
        user.password,
        user.salt
    );
    if (isValid) {
        return done(null, user);
    } else {
        return done(null, false);
    }
};

const strategy = new LocalStrategy(customFields, verify);

passport.use(strategy);

passport.serializeUser((user, done) => {
    done(null, user.email);
});

passport.deserializeUser(async (userEmail, done) => {
    var sql = `SELECT * FROM visitorTable WHERE email = '${userEmail}';`;
    const user = conn.query(sql, function (err, result) {
        if(err || !result) return {};
        else return result[0];
    });
    if (user) {
        done(null, user);
    }
});