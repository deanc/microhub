import { Request, Response } from "express"
import { User } from "../../definitions/express"
import CustomError from "../../helpers/error"
import { canEditTopic, canViewHub, isHubAdmin } from "../../helpers/permissions"
import { flattenErrors } from "../../helpers/validation"
import { topicSchema } from "../../schemas/topic"
import {
  createTopic,
  isDupeTopic,
  isTooSoonTopic,
  updateTopic,
} from "../../services/topic"
import routes from "../../helpers/routes"
import { ValidationError } from "yup"

const { connection, fetchOne } = require("../../helpers/mysql")

export default async (req: Request, res: Response, next: Function) => {
  // data structures ready for a new comment
  let data = req.body
  let errors: { [key: string]: Array<String> } = {}

  if (!req.user) {
    return next(new CustomError(401, "You must be logged in to update a topic"))
  }

  const hub = await fetchOne(connection, "SELECT * FROM hub WHERE slug = ?", [
    req.params.hub,
  ])

  // meta-data for topic
  const topic = await fetchOne(
    connection,
    `
      SELECT 
        t.*, u.username 
      FROM 
        topic AS t
      LEFT JOIN user AS u ON u.id = t.author
      WHERE t.slug = ?
    `,
    [req.params.topic]
  )

  // check permissions
  const canEdit = await canEditTopic(topic, <User>req.user)
  if (!canEdit) {
    return next(new CustomError(401, "Invalid permissions"))
  }

  if (!Object.keys(data).length) {
    data = topic
  }

  const isAdmin = await isHubAdmin(hub, <User>req.user)

  if (req.method === "POST" && req.user) {
    try {
      const isValid = await topicSchema.validate(data, { abortEarly: false })

      // non-admins can't star or publish
      if (
        (data.starred !== undefined || data.published !== undefined) &&
        !isAdmin
      ) {
        return next(new CustomError(401, "Invalid permissions"))
      }

      if (isValid && !Object.keys(errors).length) {
        const result = await updateTopic(
          topic.id,
          data.title,
          data.content,
          data.starred,
          data.published
        )
        console.log(result)
        const topicData = await fetchOne(
          connection,
          "SELECT slug FROM topic WHERE id = ?",
          [topic.id]
        )
        if (result) {
          return res.redirect(
            routes.topicView({
              hubId: hub.id,
              hubSlug: hub.slug,
              topicId: topic.id,
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

  res.render("topic/update", {
    hub,
    topic,
    data,
    errors,
    isAdmin,
    csrfToken: req.csrfToken(),
  })
}
