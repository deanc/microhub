import { Request, Response } from "express"
import { connection, fetchAll } from "../helpers/mysql"

export default async (req: Request, res: Response) => {
  let privateHubs = []

  if (req.user) {
    privateHubs = await fetchAll(
      connection,
      `
        SELECT
          h.id, h.name, h.slug
        FROM
          hub_user AS hu
        LEFT JOIN
          hub AS h ON h.id = hu.hubid
        WHERE
          hu.userid = ?
      `,
      [req.user.id]
    )
  }

  res.render("index.twig", {
    message: "Hello World",
    privateHubs,
  })
}
