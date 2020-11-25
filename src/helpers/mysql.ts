import config from "../config";
import mysql, { Connection } from "mysql2/promise";

const fetchOne = async (conn: Connection, sql: string, params = []) => {
  const [rows] = await conn.execute<any>(sql, params);
  if (rows.length) {
    return rows[0];
  }
  return null;
};

const fetchAll = async (conn: Connection, sql: string, params = []) => {
  const [rows] = await conn.execute(sql, params);
  return rows;
};

const createConnection = () =>
  mysql.createPool({
    host: config.DB_HOST,
    user: config.DB_USER,
    password: config.DB_PASSWORD,
    database: config.DB_NAME,
  });

module.exports = {
  connection: createConnection(),
  fetchOne,
  fetchAll,
};