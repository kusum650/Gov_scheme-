const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'kusum0806'
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err.message);
    return;
  }
  console.log('Connected to MySQL server.');

  connection.query('CREATE DATABASE IF NOT EXISTS schemesathi', (err) => {
    if (err) {
      console.error('Error creating database:', err.message);
      connection.end();
      return;
    }
    console.log('Database "schemesathi" created or already exists.');

    connection.query('USE schemesathi', (err) => {
      if (err) {
        console.error('Error selecting database:', err.message);
        connection.end();
        return;
      }

      const createTableQuery = `
        CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            username VARCHAR(255) NOT NULL UNIQUE,
            email VARCHAR(255) NOT NULL UNIQUE,
            contact VARCHAR(20) NOT NULL,
            password VARCHAR(255) NOT NULL
        )
      `;

      connection.query(createTableQuery, (err) => {
        if (err) {
          console.error('Error creating table:', err.message);
        } else {
          console.log('Table "users" created or already exists.');
        }
        connection.end();
      });
    });
  });
});
