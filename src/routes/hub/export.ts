import { Request, Response } from "express"
import CustomError from "../../helpers/error"
import { connection, fetchOne } from "../../helpers/mysql"
import { canViewHub, isHubAdmin } from "../../helpers/permissions"
import { User } from "../../definitions/express"

export default async (req: Request, res: Response, next: Function) => {
  // data structures ready for a new comment
  const data = req.body
  let errors: { [key: string]: Array<String> } = {}

  // check permissions
  if (!req.user) {
    return next(new CustomError(401, "Invalid permissions"))
  }

  // hub info
  const hub = await fetchOne(
    connection,
    "SELECT * FROM hub WHERE id = ? AND slug = ? AND published = 1",
    [req.params.id, req.params.hub]
  )

  if (!hub) {
    return next(new CustomError(404, "Hub not found"))
  }

  // check permissions
  const canView = await isHubAdmin(hub, <User>req.user)
  if (!canView) {
    return next(new CustomError(401, "Invalid permissions"))
  }

  console.log(req)

  // handling new comment
  if (req.method === "POST") {
  }

  res.render("hub/export", {
    data,
    hub,
    errors,
    csrfToken: req.csrfToken(),
  })
}
