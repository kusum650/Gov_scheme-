const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'kusum0806',
  multipleStatements: true
});

connection.connect((err) => {
  if (err) throw err;
  
  const sql = `
    USE schemesathi;
    DROP TABLE IF EXISTS users;
    CREATE TABLE users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) NOT NULL UNIQUE,
        email VARCHAR(255) NOT NULL UNIQUE,
        contact VARCHAR(20) NOT NULL,
        password VARCHAR(255) NOT NULL
    );
  `;

  connection.query(sql, (err) => {
    if (err) {
      console.error("Error fixing database:", err.message);
    } else {
      console.log("Database table 'users' updated successfully with all new columns!");
    }
    connection.end();
  });
});
