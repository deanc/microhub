import { Request, Response } from "express";

export default (req: Request, res: Response) => {
    res.render("index.twig", {
      message: "Hello World",
      user: req.user,
    });
  }