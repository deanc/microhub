import { User } from "../definitions/express"
import slugify from "slugify"
const { connection, fetchOne } = require("../helpers/mysql")

export const createTopic = async (
  hubId: number,
  author: number,
  title: string,
  content: string,
  starred: number
): Promise<false | number> => {
  try {
    const slug = slugify(title)
    const result = await connection.query(
      "INSERT INTO topic (hubid, author, title, slug, content, published, starred, created, updated) VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())",
      [hubId, author, title, slug, content, 1, starred]
    )
    return result[0].insertId
  } catch (e) {
    return false
  }
}

export const isDupeTopic = async (
  hubId: number,
  author: number,
  content: String
): Promise<boolean> => {
  try {
    const result = await fetchOne(
      connection,
      "SELECT id FROM topic WHERE hubid = ? AND author = ? and content = ?",
      [hubId, author, content]
    )
    return result.id ? true : false
  } catch (e) {
    return false
  }
}

export const isTooSoonTopic = async (
  hubId: number,
  author: number
): Promise<boolean> => {
  try {
    const result = await fetchOne(
      connection,
      "SELECT id FROM topic WHERE hubid = ? AND author = ? AND created > date_sub(now(), interval 5 minute) LIMIT 1",
      [hubId, author]
    )
    return result !== null
  } catch (e) {
    return false
  }
}
