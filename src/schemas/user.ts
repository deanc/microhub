import * as Yup from "yup"
const { connection, fetchOne, getConnection } = require("../helpers/mysql")

const uniqueUsername = Yup.string()
  .required()
  .min(4)
  .max(20)
  .test(
    "username",
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
  .test(
    "email",
    "email is taken", // expect an i18n message to be passed in
    async (value) => {
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
  .required()

export const userSchema = Yup.object({
  username: uniqueUsername,
  email: uniqueEmail,
  password: Yup.string().required().min(10),
  password_confirm: Yup.string().oneOf(
    [Yup.ref("password"), undefined],
    "Passwords must match"
  ),
}).defined()
