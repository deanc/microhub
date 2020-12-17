import { User } from "../definitions/express"
import bcrypt from "bcrypt"
import { update } from "../helpers/mysql"

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
      settings: {
        dark_mode: 0,
      },
    }
  } catch (e) {
    return false
  }
}

export const updateProfile = async (
  userId: number,
  password: string,
  email: string,
  darkMode: boolean
): Promise<boolean> => {
  try {
    const hash = await bcrypt.hash(password, 10)

    const fields: { [key: string]: string | number } = {
      dark_mode: darkMode ? 1 : 0,
    }
    if (password && password.length) {
      fields.password = password
    }
    if (email && email.length) {
      fields.email = email
    }

    await update(connection, "user", fields, {
      id: userId,
    })
    return true
  } catch (e) {
    console.log(e)
    return false
  }
}
