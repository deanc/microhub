import { User } from "../definitions/express"
import bcrypt from "bcrypt"

const { connection } = require("../helpers/mysql")

export const createUser = async (
  username: string,
  email: string,
  password: string
): Promise<false | User> => {
  try {
    const hash = await bcrypt.hash(password, 10)

    const result = await connection.query(
      "INSERT INTO user (username, email, password, roles) VALUES (?, ?, ?, ?)",
      [username, email, hash, "USER"]
    )
    return {
      id: result[0].insertId,
      username,
      roles: ["USER"],
    }
  } catch (e) {
    return false
  }
}
