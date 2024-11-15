import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const { MYSQL_HOST, MYSQL_PORT, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE } = process.env;

console.log({
  MYSQL_HOST,
  MYSQL_PORT,
  MYSQL_USER,
  MYSQL_PASSWORD,
  MYSQL_DATABASE
});

export async function dbConnect() {
  const connection = await mysql.createConnection({
    host: MYSQL_HOST,
    port: MYSQL_PORT,
    user: MYSQL_USER,
    password: MYSQL_PASSWORD,
    database: MYSQL_DATABASE,
  });
  return connection;
}
