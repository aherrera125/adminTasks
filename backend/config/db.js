// src/config/db.js
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

export const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'TU_PASSWORD',
  database: process.env.DB_NAME || 'adminTasks',
  port: Number(process.env.DB_PORT || 3306)
});