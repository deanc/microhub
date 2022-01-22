import { Request, Response } from "express"
import { connection, fetchAll } from "../helpers/mysql"

export default async (req: Request, res: Response) => {
  let myHubs = []

  if (req.user) {
    myHubs = await fetchAll(
      connection,
      `
        SELECT
          h.id, h.name, h.slug, h.public, hu.staff
        FROM
          hub_user AS hu
        LEFT JOIN
          hub AS h ON h.id = hu.hubid
        WHERE
          h.published = 1 AND hu.userid = ?
        ORDER BY 
          hu.staff DESC, h.name ASC
      `,
      [req.user.id]
    )
    console.log(req.user.id)
  }

  const popularHubs = await fetchAll(
    connection,
    `
    SELECT
      COUNT(*) AS total, t.hubid, h.name, h.slug, h.public
    FROM
      topic AS t
    LEFT JOIN
      hub AS h ON h.id = t.hubid
    WHERE
      h.published = 1 AND h.public = 1
    GROUP BY
      t.hubid
    ORDER BY
      total DESC
    LIMIT 5
  `
  )

  res.render("homepage", {
    message: "Hello World",
    myHubs,
    popularHubs,
  })
}
