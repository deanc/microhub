import config from "../config"
import mysql, { Pool } from "mysql2/promise"

export const fetchOne = async (
  conn: Pool,
  sql: string,
  params: Array<string | number> = []
): Promise<any> => {
  const [rows] = await conn.execute<any>(sql, params)
  if (rows.length) {
    return rows[0]
  }
  return null
}

export const fetchAll = async (
  conn: Pool,
  sql: string,
  params: Array<string | number> = []
): Promise<any> => {
  const [rows] = await conn.execute(sql, params)
  return rows
}

export const createConnection = () =>
  mysql.createPool({
    host: config.DB_HOST,
    user: config.DB_USER,
    password: config.DB_PASSWORD,
    database: config.DB_NAME,
    dateStrings: true,
  })

export const getConnection = () =>
  mysql.createConnection({
    host: config.DB_HOST,
    user: config.DB_USER,
    password: config.DB_PASSWORD,
    database: config.DB_NAME,
    dateStrings: true,
  })

export const connection = createConnection()
