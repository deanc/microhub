const LocalStrategy = require("passport-local").Strategy
import { User } from "../definitions/express"

export const localStrategy = () =>
  new LocalStrategy(
    { usernameField: "email" },
    function (
      username: string,
      password: string,
      done: (err: Error | null, user: User) => void
    ) {
      // User.findOne({ username: username }, function (err, user) {
      // if (err) { return done(err); }
      // if (!user) { return done(null, false); }
      // if (!user.verifyPassword(password)) { return done(null, false); }
      done(null, {
        id: 1,
        username: "hi",
      })
      // });
    }
  )

export const userSerializer = (
  user: User,
  cb: (err: Error | null, userId: Number) => void
) => {
  cb(null, user.id)
}

export const userDeserializer = (
  id: Number,
  cb: (err: Error | null, user: User) => void
) => {
  // db.users.findById(id, function (err, user) {
  //   if (err) { return cb(err); }
  //   cb(null, user);
  cb(null, {
    id: 1,
    username: "hi",
  })
  // });
}
