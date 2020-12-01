import { Request, Response } from "express"

export const routeHubCreateGet = (req: Request, res: Response) => {
  res.render("hub/create")
}

export const routeHubCreatePost = function (req: Request, res: Response) {
  res.redirect("/")
}
