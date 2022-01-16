import { Request, Response } from "express"
import { User } from "../../definitions/express"
import CustomError from "../../helpers/error"
import { canViewHub, isHubAdmin } from "../../helpers/permissions"
import { flattenErrors } from "../../helpers/validation"
import { topicSchema } from "../../schemas/topic"
import { createTopic, isDupeTopic, isTooSoonTopic } from "../../services/topic"
import routes from "../../helpers/routes"
import { ValidationError } from "yup"

const { connection, fetchOne, fetchAll } = require("../../helpers/mysql")

export default async (req: Request, res: Response, next: Function) => {
  // data structures ready for a new comment
  const data = req.body
  let errors: { [key: string]: Array<String> } = {}

  if (!req.user) {
    return next(new CustomError(401, "You must be logged in to create a topic"))
  }

  // meta-data for hub
  const hub = await fetchOne(connection, "SELECT * FROM hub WHERE slug = ?", [
    req.params.hub,
  ])

  // check permissions
  const canView = await canViewHub(hub, <User>req.user)
  if (!canView) {
    return next(new CustomError(401, "Invalid permissions"))
  }

  const isAdmin = await isHubAdmin(hub, <User>req.user)

  // handling new comment
  if (req.method === "POST" && req.user) {
    try {
      const result = await topicSchema.validate(data, { abortEarly: false })
      const isDupe = await isDupeTopic(hub.id, req.user.id, data.content)
      const isTooSoon = await isTooSoonTopic(hub.id, req.user.id)

      // non-admins can't star
      if (data.starred && !isAdmin) {
        return next(new CustomError(401, "Invalid permissions"))
      }

      if (isDupe) {
        errors["content"] = ["Comment already exists"]
      }
      if (isTooSoon) {
        errors["content"] = [
          "Try again in a few minutes. You're posting too often.",
        ]
      }

      if (result && !Object.keys(errors).length) {
        const topicId = await createTopic(
          hub.id,
          req.user.id,
          data.title,
          data.content,
          data.starred
        )
        const topicData = await fetchOne(
          connection,
          "SELECT slug FROM topic WHERE id = ?",
          [topicId]
        )
        if (topicId) {
          return res.redirect(
            routes.topicView({
              hubId: hub.id,
              hubSlug: hub.slug,
              topicId: topicId,
              topicSlug: topicData.slug,
            })
          )
        }
      }
    } catch (e) {
      console.log(e)
      errors = flattenErrors((e as ValidationError).inner)
    }
  }

  res.render("topic/create", {
    hub,
    data,
    errors,
    isAdmin,
    csrfToken: req.csrfToken(),
  })
}
