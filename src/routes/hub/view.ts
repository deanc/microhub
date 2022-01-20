import { Request, Response } from "express"
import {
  connection,
  fetchOne,
  fetchAll,
  fetchColumn,
} from "../../helpers/mysql"
import CustomError from "../../helpers/error"
import { User } from "../../definitions/express"
import { canViewHub, isHubAdmin } from "../../helpers/permissions"
import Pagination from "../../helpers/pagination"

export default async (req: Request, res: Response, next: Function) => {
  // meta-data for hub
  const hub = await fetchOne(
    connection,
    "SELECT * FROM hub WHERE id = ? AND slug = ?",
    [req.params.id, req.params.hub]
  )

  if (!hub) {
    return next(new CustomError(404, "Hub not found"))
  }

  // check permissions
  const canView = await canViewHub(hub, <User>req.user)
  if (!canView) {
    return next(new CustomError(401, "Invalid permissions"))
  }

  const isAdmin = await isHubAdmin(hub, <User>req.user)

  // staff
  const staff = await fetchAll(
    connection,
    `
    SELECT
      u.username
    FROM
      hub_user AS hu
    LEFT JOIN
      user AS u ON u.id = hu.userid
    WHERE
      hu.hubid = ? AND hu.staff = 1
  `,
    [hub.id]
  )

  // total members
  const totalMembers = await fetchColumn(
    connection,
    `SELECT COUNT(*) as total FROM hub_user WHERE hubid = ?`,
    [hub.id]
  )

  // topics
  let published = 1
  if (isAdmin && req.query.published === "0") {
    published = 0
  }

  const totalTopics = await fetchColumn(
    connection,
    `
    SELECT
      COUNT(*) AS total
    FROM topic as t 
    WHERE t.hubid = ? AND t.published = ?
  `,
    [hub.id, published]
  )

  const currentPage = req.query.page ? Number(req.query.page) : 1
  const pagination = new Pagination(totalTopics, currentPage, 30)
  console.log(currentPage)

  const [lower, upper] = pagination.limits()
  const topics = await fetchAll(
    connection,
    `
        SELECT
            t.*, 
            COALESCE(sq.total,0) AS total_replies,
            COALESCE(sq2.username, u.username) AS last_poster
        FROM 
            topic as t
        LEFT JOIN (
            SELECT COUNT(*) as total, topicid
            FROM comment
            GROUP BY topicid
        ) AS sq ON sq.topicid = t.id
        LEFT JOIN (
          SELECT 
            u.username, c.topicid
          FROM
            comment AS c
          LEFT JOIN user AS u ON u.id = c.author
          ORDER BY c.created DESC LIMIT 1
        ) AS sq2 ON sq2.topicid = t.id
        LEFT JOIN user AS u ON u.id = t.author
        WHERE 
            t.hubid = ? AND t.published = ?
        ORDER BY
          t.starred DESC, t.created DESC
          LIMIT ${lower}, ${upper}
       `,
    [hub.id, published]
  )

  res.render("hub/view", {
    hub,
    topics,
    staff,
    totalMembers,
    isAdmin,
    pagination: pagination.render(),
  })
}
