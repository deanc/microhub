import { Request, Response } from "express"
import CustomError from "../../helpers/error"
import { connection, fetchOne } from "../../helpers/mysql"
import { canViewHub } from "../../helpers/permissions"
import { User } from "../../definitions/express"
import routes from "../../helpers/routes"

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
    "SELECT * FROM hub WHERE id = ? AND slug = ?",
    [req.params.id, req.params.hub]
  )

  if (!hub) {
    return next(new CustomError(404, "Hub not found"))
  }

  if (hub.public) {
    return next(new CustomError(403, "You can't leave a public hub"))
  }

  // check permissions
  const canView = await canViewHub(hub, <User>req.user)
  if (!canView) {
    return next(new CustomError(401, "Invalid permissions"))
  }

  // handling new comment
  if (req.method === "POST") {
    if (data.cancel) {
      return res.redirect(
        routes.hubView({
          hubId: hub.id,
          slug: hub.slug,
        })
      )
    } else {
      await connection.execute(
        "DELETE FROM hub_user WHERE hubid = ? AND userid = ?",
        [hub.id, req.user.id]
      )
      return res.redirect("/")
    }
  }

  res.render("hub/leave", {
    data,
    hub,
    errors,
    csrfToken: req.csrfToken(),
  })
}
