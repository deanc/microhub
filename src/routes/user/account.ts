import { Request, Response } from "express"

export default (req: Request, res: Response) => {
  res.render("user/account")
}
