import { Request, Response } from "express"

export const routeUserLoginGet = (req: Request, res: Response) => {
  res.render("user/login", {
    errors: req.flash("error"),
    csrfToken: req.csrfToken(),
  })
}

export const routeUserLoginPost = (req: Request, res: Response) => {
  res.redirect("/")
}
