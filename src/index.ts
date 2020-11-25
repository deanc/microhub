import config from "./config"
import express, { Request, Response } from "express"
import { User, IGetUserAuthInfoRequest } from "./definitions/express"

// import routes
import routeHomepage from "./routes/homepage"

import { routeUserLoginGet, routeUserLoginPost } from "./routes/user/login"
import routeUserLogout from "./routes/user/logout"

import routeHubView from "./routes/hub/view"
import routeTopicView from "./routes/topic/view"

const session = require("express-session")
const passport = require("passport")
const bodyParser = require("body-parser")
import {
  localStrategy,
  userSerializer,
  userDeserializer,
} from "./auth/passport"
const twig = require("twig")
const app = express()
const port = 3000

// passport initialization
passport.use("local", localStrategy)
passport.serializeUser(userSerializer)
passport.deserializeUser(userDeserializer)

const main = async () => {
  app.use(express.static(__dirname + "/public"))
  app.set("view engine", "twig")
  app.set("views", __dirname + "/views")
  app.use(
    session({
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

  app.use(function (req: Request, res, next) {
    res.locals.user = req.user
    next()
  })

  app.set("twig options", {
    allow_async: true, // Allow asynchronous compiling
    strict_variables: false,
  })

  app.get("/login", routeUserLoginGet)

  app.post(
    "/login",
    passport.authenticate("local", { failureRedirect: "/login" }),
    routeUserLoginPost
  )

  app.get("/logout", routeUserLogout)

  app.get("/", routeHomepage)

  app.get("/m/:hub", routeHubView)

  app.get("/m/:hub/:topic", routeTopicView)

  app.listen(config.APP_PORT, () => {
    console.log(`Microhub listening at http://localhost:${config.APP_PORT}`)
  })
}

main()
