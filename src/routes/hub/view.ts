import { Request, Response } from "express"
const { connection, fetchOne, fetchAll } = require("../../helpers/mysql")

export default async (req: Request, res: Response) => {
  // meta-data for hub
  const hub = await fetchOne(connection, "SELECT * FROM hub WHERE slug = ?", [
    req.params.hub,
  ])

  // topics
  const topics = await fetchAll(
    connection,
    `
        SELECT
            t.*, COALESCE(sq.total,0) AS total_replies
        FROM 
            topic as t
        LEFT JOIN (
            SELECT COUNT(*) as total, topicid
            FROM comment
            WHERE topicid = ?
            GROUP BY topicid
        ) AS sq ON sq.topicid = t.id
        WHERE 
            t.hubid = ?
       `,
    [hub.id, hub.id]
  )

  res.render("hub.twig", {
    hub,
    topics,
  })
}
