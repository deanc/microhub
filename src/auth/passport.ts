import { Request, Response } from "express"

const LocalStrategy = require("passport-local").Strategy
import bcrypt from "bcrypt"
import { User } from "../definitions/express"
const { connection, fetchOne } = require("../helpers/mysql")

export const localStrategy = new LocalStrategy(
  { usernameField: "email" },
  async (
    username: string,
    password: string,
    done: (err: Error | null, user: User | boolean, info?: any) => void
  ) => {
    const dbUser = await fetchOne(
      connection,
      "SELECT * FROM user WHERE email = ?",
      [username]
    )

    if (!dbUser) {
      return done(null, false, { message: "Invalid credentials" })
    }

    const match = await bcrypt.compare(password, dbUser.password)
    if (!match) {
      return done(null, false, { message: "Invalid credentials" })
    }

    done(null, {
      id: dbUser.id,
      username: dbUser.username,
      roles: dbUser.roles.split(","),
      settings: {
        dark_mode: dbUser.dark_mode,
      },
    })
  }
)

export const userSerializer = (
  user: User,
  cb: (err: Error | null, userId: Number) => void
) => {
  cb(null, user.id)
}

export const userDeserializer = async (
  id: Number,
  cb: (err: Error | null, user?: User) => void
) => {
  const dbUser = await fetchOne(connection, "SELECT * FROM user WHERE id = ?", [
    id,
  ])
  if (dbUser) {
    return cb(null, {
      id: dbUser.id,
      username: dbUser.username,
      roles: dbUser.roles.split(","),
      settings: {
        dark_mode: dbUser.dark_mode,
      },
    })
  }

  cb(new Error("No user found"))

  // });
}

export const ensureAuthenticated = (
  req: Request,
  res: Response,
  next: Function
) => {
  if (req.isAuthenticated()) {
    return next()
  }
  res.redirect("/u/login")
}
