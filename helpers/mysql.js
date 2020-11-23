const { create } = require("yallist");

const config = require("../config");
const mysql = require("mysql2/promise");

const fetchOne = async (conn, sql, params = []) => {
  const [rows] = await conn.execute(sql, params);
  if (rows.length) {
    return rows[0];
  }
  return null;
};

const fetchAll = async (conn, sql, params = []) => {
  const [rows] = await conn.execute(sql, params);
  return rows;
};

const myConnection = null;

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
