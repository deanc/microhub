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

import Autolinker from "autolinker"
import { options as autoLinkerOptions } from "../../helpers/autolinker"
import { nl2br, parseUserContent, purify } from "../../helpers/escaper"
import { ValidationError } from "yup"

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

  topic.content = parseUserContent(topic.content)

  if (!topic) {
    return next(new CustomError(404, "Topic not found"))
  }

  // handling new comment
  if (req.method === "POST" && req.user && !topic.closed) {
    try {
      const result = await commentSchema.validate(data, { abortEarly: false })
      const isDupe = await isDupeComment(topic.id, req.user.id, data.content)
      const isTooSoon = await isTooSoonComment(topic.id, req.user.id)

      if (isDupe) {
        errors["content"] = ["Comment already exists"]
      }
      if (isTooSoon) {
        errors["content"] = [
          "Try again in a few minutes. You are commenting too often.",
        ]
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
      errors = flattenErrors((e as ValidationError).inner)
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

  const filteredComments = comments.map((comment: any) => {
    comment.content = parseUserContent(comment.content)
    return comment
  })

  res.render("topic/view", {
    hub,
    topic,
    comments: filteredComments,
    errors,
    data,
    csrfToken: req.csrfToken(),
  })
}
