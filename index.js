const express = require("express");
const twig = require("twig");
const app = express();
const port = 3000;

const formatDistance = require("date-fns/formatDistance");

const { connection, fetchOne, fetchAll } = require("./helpers/mysql");

//const mysqlHelper = require("./helpers/mysql");

twig.extendFunction("repeat", function (value, times) {
  return new Array(times + 1).join(value);
});

const main = async () => {
  app.use(express.static(__dirname + "/public"));

  app.set("twig options", {
    allow_async: true, // Allow asynchronous compiling
    strict_variables: false,
  });

  app.get("/", (req, res) => {
    res.render("index.twig", {
      message: "Hello World",
    });
  });

  app.get("/m/:hub", async (req, res) => {
    // meta-data for hub
    const hub = await fetchOne(connection, "SELECT * FROM hub WHERE slug = ?", [
      req.params.hub,
    ]);

    // topics
    const topics = await fetchAll(
      connection,
      `
        SELECT
            t.*, COALESCE(sq.total,0) AS total_replies
        FROM 
            topic as t
        LEFT JOIN (
            SELECT COUNT(*) as total, topicid
            FROM comment
            WHERE topicid = ?
            GROUP BY topicid
        ) AS sq ON sq.topicid = t.id
        WHERE 
            t.hubid = ?
       `,
      [hub.id, hub.id]
    );

    res.render("hub.twig", {
      hub,
      topics,
    });
  });

  app.get("/m/:hub/:topic", async (req, res) => {
    // meta-data for hub
    const hub = await fetchOne(connection, "SELECT * FROM hub WHERE slug = ?", [
      req.params.hub,
    ]);

    // topics
    const topic = await fetchOne(
      connection,
      "SELECT * FROM topic WHERE slug = ?",
      [req.params.topic]
    );

    res.render("topic.twig", {
      hub,
      topic,
    });
  });

  app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
  });
};

main();
