const mysql = require('mysql2');
const dotenv = require('dotenv');
const colors = require('colors')

dotenv.config();


const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
});

connection.connect(err => {
  if (err) throw err;
  console.log(colors.bgCyan('Conectado a la base de datos'));
});

module.exports = connection;


