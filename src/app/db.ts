import mysql from 'mysql2/promise';
import { PrismaClient } from '@prisma/client';

// 创建数据库连接池以提高性能
const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// 创建Prisma客户端实例
export const prisma = new PrismaClient();

export default pool;
