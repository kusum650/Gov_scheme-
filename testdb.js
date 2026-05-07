const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "kusum0806",
  database: "schemesathi"
});

db.connect((err) => {
  if (err) {
    console.log("ERROR:", err.message);
  } else {
    console.log("CONNECTED SUCCESSFULLY");
  }
});