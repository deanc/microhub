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

export const fetchColumn = async (
  conn: Pool,
  sql: string,
  params: Array<string | number> = []
): Promise<any> => {
  const [rows] = await conn.execute<any>(sql, params)
  if (rows.length) {
    return Object.values(rows[0])[0]
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

export const update = async (
  conn: Pool,
  table: string,
  values: { [key: string]: string | number },
  conditions: { [key: string]: string | number }
): Promise<boolean> => {
  const queryFields = Object.keys(values)
    .map((key) => `${key} = ?`)
    .join(", ")

  const queryConditions = Object.keys(conditions).map((key) => `${key} = ?`)

  const query = `UPDATE ${table} SET ${queryFields} WHERE ${queryConditions}`
  const params = [...Object.values(values), ...Object.values(conditions)]

  connection.execute(query, params)

  return true
}

export const createConnection = () =>
  mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    dateStrings: true,
  })

export const getConnection = () =>
  mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    dateStrings: true,
  })

export const connection = createConnection()
