import { Request } from "express"
export interface IGetUserAuthInfoRequest extends Request {
  user: User // or any other type
}

export interface User {
  id: Number,
  username: String
}