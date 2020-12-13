import { Request, Response } from "express"
import bcrypt from "bcrypt"
import CustomError from "../../helpers/error"
import { connection, fetchOne } from "../../helpers/mysql"
import { flattenErrors } from "../../helpers/validation"
import { conditionalUserAccountSchema } from "../../schemas/user"
import { updateProfile } from "../../services/user"
import routes from "../../helpers/routes"

export default async (req: Request, res: Response, next: Function) => {
  if (!req.user) {
    return next(new CustomError(403, "Invalid permissions"))
  }

  const data = req.body
  let errors: { [key: string]: Array<String> } = {}

  const userData = await fetchOne(
    connection,
    `
    SELECT email,password FROM user WHERE id = ?
  `,
    [req.user.id]
  )

  if (req.method === "POST") {
    let validationData = data
    if (data.email === userData.email) {
      delete validationData.email
    }

    try {
      const result = await conditionalUserAccountSchema(
        data.newpassword,
        data.email
      ).validate(validationData, {
        abortEarly: false,
      })

      // validate password
      const match = await bcrypt.compare(
        data.currentpassword,
        userData.password
      )
      if (!match) {
        errors["currentpassword"] = ["Invalid password"]
      }

      // validate new password is not same as old
      const sameMatch = await bcrypt.compare(
        data.newpassword,
        userData.password
      )
      if (data.newpassword.length && sameMatch) {
        errors["newpassword"] = ["Same as old password"]
      }

      if (result && !Object.keys(errors).length) {
        const success = await updateProfile(
          req.user.id,
          data.newpassword.length ? data.newpassword : "",
          data.email
        )
        if (success) {
          return res.redirect(routes.userAccount())
        }
      }
    } catch (e) {
      console.log(e)
      errors = flattenErrors(e.inner)
    }
  }

  const templateData = {
    ...userData,
    ...data,
  }

  res.render("user/account", {
    data: templateData,
    errors,
  })
}
