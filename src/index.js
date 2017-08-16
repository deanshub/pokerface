// @flow

import express from 'express'
import passport from 'passport'
import multer from 'multer'
import {Strategy as LocalStrategy} from 'passport-local'
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'
import expressSession from 'express-session'
import compression from 'compression'
import routes from './routes'
import graphql from './data/graphql'
import {devMiddleware, hotMiddleware} from './routes/webpack.js'
import Db from './data/db'

const app = express()
const PORT = process.env.port || 9031

app.use(compression())
app.use(cookieParser())
// app.use(bodyParser.json({ type: 'application/*+json' }))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(expressSession({
  secret: 'pa pa pa pokerface pa pa pokerface',
  resave: true,
  saveUninitialized: true,
  // cookie: {secure:true},
}))
app.use(passport.initialize())
app.use(passport.session())


if (process.env.NODE_ENV==='development'){
  app.use(devMiddleware())
  app.use(hotMiddleware())
}


passport.serializeUser((user, done) => {
  done(null, user._id)
})

passport.deserializeUser((username, done) => {
  Db.models.Player.findById(username).select('-password').then((user)=>{
    return done(null, {...user.toJSON(), fullname:user.fullname})
  }).catch(e=>{
    console.error(e)
    return done(null, false, {message: 'Email or password are Incorrect .'})
  })
})

passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
},(email, password, done) => {
  Db.models.Player.findOne({email,password}).select('-password').then((user)=>{
    return done(null, {...user.toJSON(), fullname:user.fullname})
  }).catch(e=>{
    console.error(e)
    return done(null, false, {message: 'Email or password are Incorrect .'})
  })
}))

app.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user) => {
    if (err) { return next(err) }
    if (!user) { return res.status(403).json({error:'Email or password are Incorrect .'}) }
    req.logIn(user, (err) => {
      if (err) { return next(err) }
      res.json(user)
    })
  })(req, res, next)
})

app.get('/logout', (req, res)=>{
  req.logout()
  res.redirect('/login')
})

// Multer provides multipart form data parsing.
// const storage = multer.memoryStorage()
// app.use(multer({storage}))
app.use(multer({ dest: 'uploads/' }).array())

app.use('/graphql', bodyParser.json(), graphql)

routes.apiRoutes.then(apiRoutes=>{
  apiRoutes.forEach((route)=>{
    app.use('/api', route)
  })
})

app.use('/', routes.staticRoutes)

app.listen(PORT, ()=>{
  console.log(`Pokerface server listening on port ${PORT}`)
})
