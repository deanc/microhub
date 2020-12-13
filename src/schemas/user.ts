import { UrlWithParsedQuery } from "url"
import * as Yup from "yup"
const { connection, fetchOne, getConnection } = require("../helpers/mysql")

const uniqueUsername = Yup.string()
  .required()
  .min(4)
  .max(20)
  .test("usernameBadWord", "this username is not allowed", (value) => {
    const badStrings = process.env.BAD_USERNAMES?.split(",")
    if (badStrings && value) {
      return badStrings?.some((bad) => value.includes(bad))
    }
    return true
  })
  .test(
    "usernameUnique",
    "username is taken", // expect an i18n message to be passed in
    async (value) => {
      try {
        const row = await fetchOne(
          connection,
          "SELECT id FROM user WHERE username = ?",
          [value]
        )

        if (!row) {
          return true
        }

        return false
      } catch (e) {
        return false
      }
    }
  )

const uniqueEmail = Yup.string()
  .max(255)
  .email()
  .required()
  .test(
    "email",
    "email is taken", // expect an i18n message to be passed in
    async (value) => {
      if (!value) {
        return false
      }

      try {
        const row = await fetchOne(
          connection,
          "SELECT id FROM user WHERE email = ?",
          [value]
        )

        if (!row) {
          return true
        }

        return false
      } catch (e) {
        return false
      }
    }
  )

export const userSchema = Yup.object({
  username: uniqueUsername,
  email: uniqueEmail,
  password: Yup.string().required().min(10),
  password_confirm: Yup.string().oneOf(
    [Yup.ref("password"), undefined],
    "Passwords must match"
  ),
}).defined()

export const conditionalUserAccountSchema = (
  newPassword: string,
  email: string
) => {
  const schema: { [key: string]: Yup.Schema<any> } = {
    currentpassword: Yup.string().required(),
  }

  if (newPassword) {
    schema.newpassword = Yup.string().min(10)
  }

  if (email) {
    schema.email = uniqueEmail
  }

  return Yup.object(schema).defined()
}
