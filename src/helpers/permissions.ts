import { User } from "../definitions/express"
import { connection, fetchOne } from "./mysql"

export const canViewHub = async (hub: any, user: User): Promise<boolean> => {
  // admins can view all
  if (user.roles.includes("ADMIN")) {
    return true
  }

  // other users need normal check
  if (!hub.public) {
    if (!user) {
      return false
    } else {
      const userCheck = await fetchOne(
        connection,
        "SELECT * FROM hub_user WHERE hubid = ? AND userid = ?",
        [hub.id, user.id]
      )
      if (!userCheck) {
        return false
      }
    }
  }
  return true
}
