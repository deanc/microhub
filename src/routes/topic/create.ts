import { Request, Response } from "express"
import { User } from "../../definitions/express"
import CustomError from "../../helpers/error"
import { canViewHub } from "../../helpers/permissions"
import { flattenErrors } from "../../helpers/validation"
import { topicSchema } from "../../schemas/topic"
import { createTopic, isDupeTopic, isTooSoonTopic } from "../../services/topic"

const { connection, fetchOne, fetchAll } = require("../../helpers/mysql")

export default async (req: Request, res: Response, next: Function) => {
  // data structures ready for a new comment
  const data = req.body
  let errors: { [key: string]: Array<String> } = {}

  // meta-data for hub
  const hub = await fetchOne(connection, "SELECT * FROM hub WHERE slug = ?", [
    req.params.hub,
  ])

  // check permissions
  const canView = await canViewHub(hub, <User>req.user)
  if (!canView) {
    return next(new CustomError(401, "Invalid permissions"))
  }

  // handling new comment
  if (req.method === "POST" && req.user) {
    try {
      const result = await topicSchema.validate(data, { abortEarly: false })
      const isDupe = await isDupeTopic(hub.id, req.user.id, data.content)
      const isTooSoon = await isTooSoonTopic(hub.id, req.user.id)

      console.log(isDupe, isTooSoon)

      if (isDupe) {
        errors["content"] = ["Comment already exists"]
      }
      if (isTooSoon) {
        errors["content"] = ["Try again in a minute"]
      }

      if (result && !Object.keys(errors).length) {
        const topicId = await createTopic(
          hub.id,
          req.user.id,
          data.title,
          data.content
        )
        const topicData = await fetchOne(
          connection,
          "SELECT slug FROM topic WHERE id = ?",
          [topicId]
        )
        if (topicId) {
          return res.redirect(`/m/${hub.slug}/${topicData.slug}`)
        }
      }
    } catch (e) {
      console.log(e)
      errors = flattenErrors(e.inner)
    }
  }

  res.render("topic/create", {
    hub,
    errors,
  })
}
