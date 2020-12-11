require("dotenv").config({ path: __dirname + "/.env" })

import express, { Request, Response } from "express"
import compression from "compression"
import flash from "connect-flash"
import helmet from "helmet"
import csrf from "csurf"
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
import routeHubCreate from "./routes/hub/create"
import routeHubLeave from "./routes/hub/leave"
import routeHubMembers from "./routes/hub/members"

import routes from "./helpers/routes"

// create session store
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

// csrf protection
const csrfProtection = csrf()

// add custom twig function(s)
import { timeAgoInWords, mysqlToDate } from "./helpers/time"
twig.extendFunction("timeAgoInWords", function (value) {
  return timeAgoInWords(mysqlToDate(value))
})
twig.extendFunction("url", (routeName: string, params = {}): string => {
  if (!routes[routeName]) {
    throw new Error("invalid route")
  }

  const routeFunction = routes[routeName]
  return routeFunction(params)
})

const main = async () => {
  app.use(compression())
  app.use(helmet())
  app.use(flash())
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
    res.locals.routes = routes
    next()
  })

  app.set("twig options", {
    allow_async: true, // Allow asynchronous compiling
    strict_variables: false,
    autoescape: true,
  })

  app.get("/u/login", csrfProtection, routeUserLoginGet)
  app.post(
    "/u/login",
    csrfProtection,
    passport.authenticate("local", {
      failureRedirect: "/u/login",
      failureFlash: true,
    }),
    routeUserLoginPost
  )

  app.get("/u/register", csrfProtection, routeUserRegisterGet)
  app.post("/u/register", csrfProtection, routeUserRegisterPost)

  app.get("/u/account", ensureAuthenticated, routeUserAccount)
  app.get("/u/logout", ensureAuthenticated, routeUserLogout)
  app.get("/", routeHomepage)
  app.get("/m/:hub-:id(\\d+)", routeHubView)
  app.get("/m/:hub-:id(\\d+)/rss", routeHubRSS)
  app.get("/hub/create", csrfProtection, routeHubCreate)
  app.post("/hub/create", csrfProtection, routeHubCreate)

  app.get("/m/:hub-:id(\\d+)/leave", csrfProtection, routeHubLeave)
  app.post("/m/:hub-:id(\\d+)/leave", csrfProtection, routeHubLeave)

  app.get("/m/:hub-:id(\\d+)/members", csrfProtection, routeHubMembers)
  app.post("/m/:hub-:id(\\d+)/members", csrfProtection, routeHubMembers)

  app.get("/m/:hub-:id(\\d+)/new", csrfProtection, routeTopicCreate)
  app.post("/m/:hub-:id(\\d+)/new", csrfProtection, routeTopicCreate)

  app.get("/m/:hub-:id(\\d+)/:topic-:id(\\d+)", csrfProtection, routeTopicView)
  app.post("/m/:hub-:id(\\d+)/:topic-:id(\\d+)", csrfProtection, routeTopicView)

  // error handle
  app.use(function (err: Error, req: Request, res: Response, next: Function) {
    if (err instanceof CustomError) {
      res.status(err.code).render("error", {
        message: err.message,
      })
    } else {
      console.log(err.message)
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
