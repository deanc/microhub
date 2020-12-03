import { Request, Response } from "express"
import { connection, fetchOne, fetchAll } from "../../helpers/mysql"
import CustomError from "../../helpers/error"
import { Feed } from "feed"
import { mysqlToDate } from "../../helpers/time"

export default async (req: Request, res: Response, next: Function) => {
  // meta-data for hub
  const hub = await fetchOne(connection, "SELECT * FROM hub WHERE slug = ?", [
    req.params.hub,
  ])

  // check permissions
  const isPrivate = !hub.public
  if (isPrivate) {
    return next(new CustomError(404, "RSS feeds are only for public hubs"))
  }

  // topics
  const topics = await fetchAll(
    connection,
    `
        SELECT
            t.*
        FROM 
            topic as t
        LEFT JOIN user AS u ON u.id = t.author
        WHERE 
            t.hubid = ?
        ORDER BY
          t.created DESC
        LIMIT 50
       `,
    [hub.id]
  )

  const feed = new Feed({
    title: hub.name,
    description: `Latest posts in ${hub.name}`,
    id: "http://example.com/",
    link: "http://example.com/",
    language: "en", // optional, used only in RSS 2.0, possible values: http://www.w3.org/TR/REC-html40/struct/dirlang.html#langcodes
    // image: "http://example.com/image.png",
    // favicon: "http://example.com/favicon.ico",
    copyright: "All rights reserved, MicroHub",
    updated: new Date(2013, 6, 14), // optional, default = today
    generator: "n/a", // optional, default = 'Feed for Node.js'
    // feedLinks: {
    //   json: "https://example.com/json",
    //   atom: "https://example.com/atom",
    // },
    // author: {
    //   name: "John Doe",
    //   email: "johndoe@example.com",
    //   link: "https://example.com/johndoe",
    // },
  })

  topics.forEach((topic: any) => {
    feed.addItem({
      title: topic.title,
      id: topic.id,
      link: "asdfads",
      content: topic.content,
      date: mysqlToDate(topic.created),
    })
  })

  res.set("Content-Type", "application/rss+xml")
  res.send(feed.rss2())
}
