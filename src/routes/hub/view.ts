import { Request, Response } from "express"
import { connection, fetchOne, fetchAll } from "../../helpers/mysql"
import CustomError from "../../helpers/error"
import { User } from "../../definitions/express"
import { canViewHub } from "../../helpers/permissions"

export default async (req: Request, res: Response, next: Function) => {
  // meta-data for hub
  const hub = await fetchOne(connection, "SELECT * FROM hub WHERE slug = ?", [
    req.params.hub,
  ])

  // check permissions
  const canView = await canViewHub(hub, <User>req.user)
  if (!canView) {
    return next(new CustomError(401, "Invalid permissions"))
  }

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

  // topics
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
            WHERE topicid = ?
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
            t.hubid = ?
        ORDER BY
          t.starred DESC, t.created DESC
       `,
    [hub.id, hub.id]
  )

  res.render("hub.twig", {
    hub,
    topics,
    staff,
  })
}
