import { User as UserDocument } from "./express"

declare namespace Express {
  export interface Request {
    user?: User
    logout(): void
  }
}

declare global {
  namespace Express {
    interface User extends UserDocument {}
  }
}
