const mysql = require('mysql');
const dotenv = require('dotenv');

function connectToDatabase(){
    const db = {};
    dotenv.config({path: './config.env'});
    db.conn = mysql.createConnection({
        host: process.env.HOST,
        user: process.env.USERNAME,
        password: process.env.PASSWORD,
        database: process.env.DATABASE
    });
    db.conn.connect(function(err){
        if(err) console.log("Error connecting to database.");
        else console.log("Connected to database.");
    });
    return db;
};

module.exports = connectToDatabase();