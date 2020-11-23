const express = require("express");
const session = require("express-session");
const passport = require("passport");
const bodyParser = require("body-parser");
const LocalStrategy = require("passport-local").Strategy;
const twig = require("twig");
const app = express();
const port = 3000;

const formatDistance = require("date-fns/formatDistance");

const { connection, fetchOne, fetchAll } = require("./helpers/mysql");

//const mysqlHelper = require("./helpers/mysql");

twig.extendFunction("repeat", function (value, times) {
  return new Array(times + 1).join(value);
});

passport.use(
  new LocalStrategy(function (username, password, done) {
    // User.findOne({ username: username }, function (err, user) {
    // if (err) { return done(err); }
    // if (!user) { return done(null, false); }
    // if (!user.verifyPassword(password)) { return done(null, false); }
    return done(null, {
      id: 1,
      username: "hi",
    });
    // });
  })
);

passport.serializeUser(function (user, cb) {
  cb(null, user.id);
});

passport.deserializeUser(function (id, cb) {
  // db.users.findById(id, function (err, user) {
  //   if (err) { return cb(err); }
  //   cb(null, user);
  return cb(null, {
    id: 1,
    username: "hi",
  });
  // });
});

const main = async () => {
  app.use(express.static(__dirname + "/public"));
  app.set("view engine", "twig");
  app.set("views", __dirname + "/views");
  app.use(
    session({
      secret: "cookie_secret",
      name: "hubsess",
      //store: sessionStore, // connect-mongo session store
      proxy: true,
      resave: true,
      saveUninitialized: true,
    })
  );
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(bodyParser.urlencoded({ extended: true }));

  app.use(function (req, res, next) {
    res.locals.user = req.user;
    next();
  });

  app.set("twig options", {
    allow_async: true, // Allow asynchronous compiling
    strict_variables: false,
  });

  app.get("/login", function (req, res) {
    res.render("login");
  });

  app.post(
    "/login",
    passport.authenticate("local", { failureRedirect: "/login" }),
    function (req, res) {
      res.redirect("/");
    }
  );

  app.get("/logout", function (req, res) {
    req.logout();
    res.redirect("/");
  });

  app.get("/", (req, res) => {
    res.render("index.twig", {
      message: "Hello World",
      user: req.user,
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
    console.log(`Microhub listening at http://localhost:${port}`);
  });
};

main();
