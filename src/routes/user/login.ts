import { Request, Response } from "express"

export const routeUserLoginGet = (req: Request, res: Response) => {
  res.render("login")
}

export const routeUserLoginPost = function (req: Request, res: Response) {
  res.redirect("/")
}
