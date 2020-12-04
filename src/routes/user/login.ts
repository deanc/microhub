import { Request, Response } from "express"

export const routeUserLoginGet = (req: Request, res: Response) => {
  res.render("login", {
    errors: req.flash("error"),
  })
}

export const routeUserLoginPost = (req: Request, res: Response) => {
  res.redirect("/")
}
