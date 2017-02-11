import express from 'express'
import path from 'path'
import passport from 'passport'
import {Strategy as LocalStrategy} from 'passport-local'
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'
import expressSession from 'express-session'

const app = express()
const PORT = process.env.port || 9031
const STATIC_FILES_DIRECTORY = path.join(__dirname,'../../client/static')

app.use('/', express.static(STATIC_FILES_DIRECTORY))
app.use(cookieParser())
// app.use(bodyParser.json({ type: 'application/*+json' }))
app.use(bodyParser.json())
// app.use(bodyParser.urlencoded({ extended: true }))
app.use(expressSession({
  secret: 'pa pa pa pokerface pa pa pokerface',
  resave: false,
  saveUninitialized: true,
  cookie: {secure:true},
}))
app.use(passport.initialize())
app.use(passport.session())

passport.serializeUser((user, done) => {
  done(null, user.email)
})

passport.deserializeUser((email, done) => {
  if (email==='demo@pokerface.io'){
    return done(null, {email,username:'demo'})
  }else{
    return done(null, false, {message: 'Incorrect authentication details.'})
  }
  // User.findById(id, (err, user) => {
  //   done(err, user)
  // })
})

passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
},(email, password, done) => {
  if (email==='demo@pokerface.io' && password==='demo'){
    return done(null, {email,username:'demo'})
  }else{
    return done(null, false, {message: 'Incorrect authentication details.'})
  }
  // User.findOne({ username: username }, function(err, user) {
  //   if (err) { return done(err); }
  //   if (!user) {
  //     return done(null, false, { message: 'Incorrect username.' });
  //   }
  //   if (!user.validPassword(password)) {
  //     return done(null, false, { message: 'Incorrect password.' });
  //   }
  //   return done(null, user);
  // });
}))

app.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user) => {
    if (err) { return next(err) }
    if (!user) { return res.redirect('/login') }
    req.logIn(user, (err) => {
      if (err) { return next(err) }
      return res.redirect('/')
      // return res.redirect(`/profile/${user.username}`)
    })
  })(req, res, next)
})



app.listen(PORT, ()=>{
  console.log(`Pokerface server listening on port ${PORT}`)
})
