import { differenceInMinutes } from "date-fns"
import { User } from "../definitions/express"
import { userSchema } from "../schemas/user"
import { connection, fetchOne } from "./mysql"
import { mysqlToDate } from "./time"

const isAdmin = (user: User): boolean => user?.roles.includes("ADMIN")

export const canViewHub = async (hub: any, user: User): Promise<boolean> => {
  // admins can view all
  if (isAdmin(user)) {
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

export const isHubAdmin = async (hub: any, user: User): Promise<boolean> => {
  // admins can view all
  if (user && user.roles.includes("ADMIN")) {
    return true
  }

  // other users need normal check
  if (!hub.public) {
    if (!user) {
      return false
    } else {
      const userCheck = await fetchOne(
        connection,
        "SELECT * FROM hub_user WHERE hubid = ? AND userid = ? AND staff = 1",
        [hub.id, user.id]
      )
      if (userCheck) {
        return true
      }
    }
  }
  return false
}

export const canEditTopic = async (
  topic: any,
  user: User
): Promise<boolean> => {
  const isAuthor = topic.author === user?.id
  const isWithinFiveMinutes = differenceInMinutes(
    mysqlToDate(topic.created),
    new Date()
  )

  if (isAdmin || (isAuthor && isWithinFiveMinutes)) {
    return true
  }

  return false
}
