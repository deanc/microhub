declare namespace Express {
    export interface Request {
       user?: User,
       logout(): void
    }
 }