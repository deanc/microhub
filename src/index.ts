require("dotenv").config({ path: __dirname + "/.env" })

import express, { Request, Response } from "express"
import compression from "compression"
import CustomError from "./helpers/error"

import redis from "redis"
import session from "express-session"
import passport from "passport"
import bodyParser from "body-parser"
import {
  localStrategy,
  userSerializer,
  userDeserializer,
} from "./auth/passport"

import twig from "twig"
import { ensureAuthenticated } from "./auth/passport"

// import routes
import routeHomepage from "./routes/homepage"

import { routeUserLoginGet, routeUserLoginPost } from "./routes/user/login"
import {
  routeUserRegisterGet,
  routeUserRegisterPost,
} from "./routes/user/register"
import routeUserLogout from "./routes/user/logout"
import routeUserAccount from "./routes/user/account"

import routeHubView from "./routes/hub/view"
import routeHubRSS from "./routes/hub/rss"
import routeTopicView from "./routes/topic/view"
import routeTopicCreate from "./routes/topic/create"
import { routeHubCreateGet } from "./routes/hub/create"

// create session store
console.log(process.env)
let RedisStore = require("connect-redis")(session)
let redisConfig: any = {
  url: process.env.REDIS_URL,
}
if (process.env.REDIS_PASSWORD) {
  redisConfig["password"] = process.env.REDIS_PASSWORD
}
const redisClient = redis.createClient(redisConfig)

const app = express()

// passport initialization
passport.use(localStrategy)
passport.serializeUser(userSerializer)
passport.deserializeUser(userDeserializer)

// add custom twig function(s)
import { timeAgoInWords, mysqlToDate } from "./helpers/time"
twig.extendFunction("timeAgoInWords", function (value) {
  return timeAgoInWords(mysqlToDate(value))
})

const main = async () => {
  app.use(compression())
  app.use(express.static(__dirname + "/public"))
  app.set("view engine", "twig")
  app.set("views", __dirname + "/views")
  app.use(
    session({
      store: new RedisStore({ client: redisClient }),
      secret: "cookie_secret",
      name: "hubsess",
      //store: sessionStore, // connect-mongo session store
      proxy: true,
      resave: true,
      saveUninitialized: true,
    })
  )

  app.use(passport.initialize())
  app.use(passport.session())
  app.use(bodyParser.urlencoded({ extended: true }))

  app.use(function (req, res, next) {
    res.locals.user = req.user
    next()
  })

  app.set("twig options", {
    allow_async: true, // Allow asynchronous compiling
    strict_variables: false,
    autoescape: true,
  })

  app.get("/login", routeUserLoginGet)
  app.post(
    "/login",
    passport.authenticate("local", { failureRedirect: "/login" }),
    routeUserLoginPost
  )

  app.get("/register", routeUserRegisterGet)
  app.post("/register", routeUserRegisterPost)

  app.get("/account", ensureAuthenticated, routeUserAccount)
  app.get("/logout", ensureAuthenticated, routeUserLogout)
  app.get("/", routeHomepage)
  app.get("/m/:hub", routeHubView)
  app.get("/m/:hub/rss", routeHubRSS)
  app.get("/hub/create", routeHubCreateGet)

  app.get("/m/:hub/new", routeTopicCreate)
  app.post("/m/:hub/new", routeTopicCreate)

  app.get("/m/:hub/:topic", routeTopicView)
  app.post("/m/:hub/:topic", routeTopicView)

  // error handle
  app.use(function (err: Error, req: Request, res: Response, next: Function) {
    if (err instanceof CustomError) {
      res.status(err.code).render("error", {
        message: err.message,
      })
    } else {
      res.status(500).render("error", {
        message: "Something went wrong",
      })
    }
  })

  app.listen(process.env.APP_PORT, () => {
    console.log(
      `Microhub listening at http://localhost:${process.env.APP_PORT}`
    )
  })
}

main()
