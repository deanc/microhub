import { User } from "../definitions/express"
import slugify from "slugify"
const { connection, fetchOne } = require("../helpers/mysql")

export const createHub = async (
  creator: number,
  name: string,
  description: string,
  isPublic: number
): Promise<false | number> => {
  try {
    // create the hub
    const slug = slugify(name)
    const result = await connection.query(
      "INSERT INTO hub (creator, name, description, slug, public, published, created, updated) VALUES (?, ?, ?, ?, 1, 1, NOW(), NOW())",
      [creator, name, description, slug, isPublic]
    )

    const hubId = result[0].insertId

    // make the creator an admin of it
    await connection.query(
      "INSERT INTO hub_user (hubid, userid, staff) VALUES (?, ?, ?)",
      [hubId, creator, 1]
    )

    await connection.query(
      "UPDATE user_log SET last_created_hub = NOW() WHERE userid = ?",
      [creator]
    )

    return hubId
  } catch (e) {
    console.log(e)
    return false
  }
}

export const isDupeHub = async (
  author: number,
  name: String
): Promise<boolean> => {
  try {
    const result = await fetchOne(
      connection,
      "SELECT id FROM topic WHERE hubid = ? AND author = ? and content = ?",
      [author, name]
    )
    return result.id ? true : false
  } catch (e) {
    return false
  }
}

export const addMember = async (
  hubId: number,
  userId: String,
  staff: number = 0
): Promise<boolean> => {
  try {
    await connection.query(
      "INSERT INTO hub_user (hubid, userid, staff) VALUES (?,?,?)",
      [hubId, userId, staff]
    )
    return true
  } catch (e) {
    return false
  }
}
