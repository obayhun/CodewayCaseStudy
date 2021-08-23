var mysql = require('mysql');
const dotenv = require('dotenv');
dotenv.config();

var connection = mysql.createConnection({
    host: process.env.host,
    user: process.env.user,
    password: process.env.password,
    database: process.env.database
});

connection.connect((err)=> {
    if (!err) {
        console.log("Database is connected");
    } else {
        console.log("IP address might not be in whitelist. Database is not connected" + err);
    }
}
);

module.exports = connection;