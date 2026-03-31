const mysql = require("mysql");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "csc_center"
});

db.connect(err => {
  if (err) {
    console.log("⚠️ Database not connected (online deploy)");
  } else {
    console.log("MySQL Connected");
  }
});

module.exports = db;