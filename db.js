var mysql = require('mysql');
var creds = require('./dbcreds.json');
var db;

function connectDatabase() {
    if (!db) {
        db = mysql.createConnection(creds);
        db.connect(function(err){
            if(!err) {
                console.log(`Database Connection Established at ${creds.host}`);
            } else {
                console.log(err);
            }
        });
    }
    return db;
}

module.exports = connectDatabase();