import { Request, Response } from "express"
import { flattenErrors } from "../../helpers/validation"
import CustomError from "../../helpers/error"
import { hubSchema } from "../../schemas/hub"
import { createHub } from "../../services/hub"
import { connection, fetchOne } from "../../helpers/mysql"
import { ValidationError } from "yup"

export default async (req: Request, res: Response, next: Function) => {
  // data structures ready for a new comment
  const data = req.body
  let errors: { [key: string]: Array<String> } = {}

  // check permissions
  if (!req.user) {
    return next(
      new CustomError(401, "Please create an account or log in to create a hub")
    )
  }

  // handling new comment
  if (req.method === "POST") {
    try {
      const result = await hubSchema.validate(data, { abortEarly: false })
      // const isTooSoon = await isTooSoonHub(hub.id, req.user.id)

      // if (isTooSoon) {
      //   errors["content"] = ["Try again in a minute"]
      // }

      if (result && !Object.keys(errors).length) {
        const hubId = await createHub(
          req.user.id,
          data.name,
          data.description,
          data.public
        )
        if (hubId) {
          const hub = await fetchOne(
            connection,
            "SELECT slug FROM hub WHERE id = ?",
            [hubId]
          )
          return res.redirect(`/m/${hub.slug}-${hubId}`)
        }
      }
    } catch (e) {
      console.log(e)
      errors = flattenErrors((e as ValidationError).inner)
    }
  }
  console.log(errors)

  res.render("hub/create", {
    data,
    errors,
    csrfToken: req.csrfToken(),
  })
}
