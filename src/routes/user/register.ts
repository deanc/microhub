import { Request, Response } from "express"
import { User } from "../../definitions/express"
import { userSchema } from "../../schemas/user"
import { flattenErrors } from "../../helpers/validation"
import { createUser } from "../../services/user"

export const routeUserRegisterGet = (req: Request, res: Response) => {
  res.render("user/register", {
    csrfToken: req.csrfToken(),
  })
}

const login = (req: Request, res: Response, user: User) => {
  new Promise((resolve, reject) => {
    req.login(user, (err) => {
      if (err) {
        return reject(err)
      }
      resolve(user)
    })
  })
}

export const routeUserRegisterPost = async function (
  req: Request,
  res: Response
) {
  const data = req.body
  let errors: { [key: string]: Array<String> } = {}

  try {
    const result = await userSchema.validate(data, { abortEarly: false })
    if (result) {
      const userCreated = await createUser(
        data.username,
        data.email,
        data.password
      )
      if (userCreated) {
        try {
          const userLogin = await login(req, res, userCreated)
          return res.redirect("/account")
        } catch (e) {}
      }
    }
  } catch (e) {
    errors = flattenErrors(e.inner)
  }

  res.render("user/register", {
    errors,
    data,
    csrfToken: req.csrfToken(),
  })
}
