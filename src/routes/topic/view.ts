import { Request, Response } from "express"
import { User } from "../../definitions/express"
import CustomError from "../../helpers/error"
import { canViewHub } from "../../helpers/permissions"
import routes from "../../helpers/routes"
import { flattenErrors } from "../../helpers/validation"
import { commentSchema } from "../../schemas/comment"
import {
  createComment,
  isDupeComment,
  isTooSoonComment,
} from "../../services/comment"
const { connection, fetchOne, fetchAll } = require("../../helpers/mysql")

const formatDistance = require("date-fns/formatDistance")

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

  // topic
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

  if (!topic) {
    return next(new CustomError(404, "Topic not found"))
  }

  // handling new comment
  if (req.method === "POST" && req.user && !topic.closed) {
    try {
      const result = await commentSchema.validate(data, { abortEarly: false })
      const isDupe = await isDupeComment(topic.id, req.user.id, data.content)
      const isTooSoon = await isTooSoonComment(topic.id, req.user.id)

      console.log(isDupe, isTooSoon)

      if (isDupe) {
        errors["content"] = ["Comment already exists"]
      }
      if (isTooSoon) {
        errors["content"] = ["Try again in a minute"]
      }

      if (result && !Object.keys(errors).length) {
        const commentId = await createComment(
          topic.id,
          req.user.id,
          data.content
        )
        if (commentId) {
          return res.redirect(
            routes.topicView({
              hubId: hub.id,
              hubSlug: hub.slug,
              topicId: topic.id,
              topicSlug: topic.slug,
            }) + `#comment-${commentId}`
          )
        }
      }
    } catch (e) {
      console.log(e)
      errors = flattenErrors(e.inner)
    }
  }

  // comments
  const comments = await fetchAll(
    connection,
    `
      SELECT
        u.username, c.*
      FROM
        comment AS c
      LEFT JOIN
        user AS u ON u.id = c.author
      WHERE
        c.topicid = ?
      ORDER BY
        created ASC
    `,
    [topic.id]
  )

  res.render("topic/view", {
    hub,
    topic,
    comments,
    errors,
    csrfToken: req.csrfToken(),
  })
}
