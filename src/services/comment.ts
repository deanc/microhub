import { User } from "../definitions/express"

const { connection, fetchOne } = require("../helpers/mysql")

export const createComment = async (
  topicId: number,
  author: number,
  content: String
): Promise<false | number> => {
  try {
    const result = await connection.query(
      "INSERT INTO comment (topicid, author, content, published, created, updated) VALUES (?, ?, ?, ?, NOW(), NOW())",
      [topicId, author, content, 1]
    )
    await connection.query("UPDATE topic SET updated = NOW() WHERE id = ?", [
      topicId,
    ])
    return result[0].insertId
  } catch (e) {
    return false
  }
}

export const isDupeComment = async (
  topicId: number,
  author: number,
  content: String
): Promise<boolean> => {
  try {
    const result = await fetchOne(
      connection,
      "SELECT id FROM comment WHERE topicid = ? AND author = ? and content = ?",
      [topicId, author, content]
    )
    return result.id ? true : false
  } catch (e) {
    return false
  }
}

export const isTooSoonComment = async (
  topicId: number,
  author: number
): Promise<boolean> => {
  try {
    const result = await fetchOne(
      connection,
      "SELECT id FROM comment WHERE topicid = ? AND author = ? AND created > date_sub(now(), interval 5 minute) LIMIT 1",
      [topicId, author]
    )
    return result !== null
  } catch (e) {
    return false
  }
}
