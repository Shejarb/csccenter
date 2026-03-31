const mysql = require("mysql");

const db = mysql.createConnection({
  host: "your-host",
  user: "your-user",
  password: "your-password",
  database: "your-db",
  port: 3306
});

db.connect(err => {
  if (err) {
    console.log("DB Error:", err.message);
  } else {
    console.log("Database Connected ✅");
  }
});

module.exports = db;