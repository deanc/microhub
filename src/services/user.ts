import { User } from "../definitions/express"

const { connection } = require("../helpers/mysql")

export const createUser = async (
  username: String,
  email: String,
  password: String
): Promise<false | User> => {
  try {
    const result = await connection.query(
      "INSERT INTO user (username, email, password) VALUES (?, ?, ?)",
      [username, email, password]
    )
    return {
      id: result[0].insertId,
      username,
    }
  } catch (e) {
    return false
  }
}
