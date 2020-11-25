import { Request, Response } from "express"
const { connection, fetchOne } = require("../../helpers/mysql")

const formatDistance = require("date-fns/formatDistance")

export default async (req: Request, res: Response) => {
  // meta-data for hub
  const hub = await fetchOne(connection, "SELECT * FROM hub WHERE slug = ?", [
    req.params.hub,
  ])

  // topics
  const topic = await fetchOne(
    connection,
    "SELECT * FROM topic WHERE slug = ?",
    [req.params.topic]
  )

  res.render("topic.twig", {
    hub,
    topic,
  })
}
