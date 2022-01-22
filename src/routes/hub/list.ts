import { Request, Response } from "express"
import { connection, fetchColumn, fetchAll } from "../../helpers/mysql"
import CustomError from "../../helpers/error"
import Pagination from "../../helpers/pagination"

export default async (req: Request, res: Response, next: Function) => {
  const totalHubs = await fetchColumn(
    connection,
    `
        SELECT
          COUNT(*) AS total
        FROM hub as h
        WHERE h.published = 1 AND h.public = 1
      `
  )

  const currentPage = req.query.page ? Number(req.query.page) : 1
  const pagination = new Pagination(totalHubs, currentPage, 50)

  const [lower, upper] = pagination.limits()

  const hubs = await fetchAll(
    connection,
    `
        SELECT
            h.*
        FROM 
            hub AS h
        WHERE
            h.published = 1 AND h.public = 1
        ORDER BY
            h.name ASC
        LIMIT ${lower},${upper}
    `
  )

  res.render("hub/list", {
    hubs,
    pagination: pagination.render(),
  })
}
