import { Request, Response } from "express"
import CustomError from "../../helpers/error"
import {
  connection,
  fetchAll,
  fetchColumn,
  fetchOne,
} from "../../helpers/mysql"
import { canViewHub } from "../../helpers/permissions"
import { User } from "../../definitions/express"
import routes from "../../helpers/routes"
import { hubMemberSchema } from "../../schemas/hubMember"
import { flattenErrors } from "../../helpers/validation"
import { addMember } from "../../services/hub"

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

  // check permissions
  const canView = await canViewHub(hub, <User>req.user)
  if (!canView) {
    return next(new CustomError(401, "Invalid permissions"))
  }

  if (hub.public) {
    return next(new CustomError(403, "Public hubs have no members"))
  }

  // members
  const members = await fetchAll(
    connection,
    `
    SELECT
        u.username, hu.staff
    FROM
        hub_user AS hu
    LEFT JOIN
        user AS u ON u.id = hu.userid
    WHERE
        hu.hubid = ?
    ORDER BY hu.staff DESC, u.username ASC
  `,
    [hub.id]
  )

  if (req.method === "POST") {
    try {
      const result = await hubMemberSchema.validate(data, { abortEarly: false })

      const userData = await fetchOne(
        connection,
        "SELECT * FROM user WHERE username = ?",
        [data.username]
      )
      if (!userData) {
        errors["username"] = ["No user with this username"]
      } else {
        const hasMemberRow = await fetchColumn(
          connection,
          "SELECT * FROM hub_user WHERE hubid = ? AND userid = ?",
          [hub.id, userData.id]
        )
        if (hasMemberRow) {
          errors["username"] = ["User is already a member"]
        }
      }

      if (result && !Object.keys(errors).length) {
        const addedMember = await addMember(hub.id, userData.id)
        if (addedMember) {
          req.flash("message", "Member added")
          return res.redirect(
            routes.hubMembers({
              hubId: hub.id,
              slug: hub.slug,
            })
          )
        }
      }
    } catch (e) {
      console.log(e)
      errors = flattenErrors(e.inner)
    }
  }

  res.render("hub/members", {
    data,
    hub,
    members,
    errors,
    messages: req.flash("message"),
    csrfToken: req.csrfToken(),
  })
}
