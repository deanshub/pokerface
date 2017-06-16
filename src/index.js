// @flow

import express from 'express'
import path from 'path'
import passport from 'passport'
import {Strategy as LocalStrategy} from 'passport-local'
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'
import expressSession from 'express-session'
import compression from 'compression'
import apiRoutes from './routes'
import graphql from './data/graphql'
import {devMiddleware, hotMiddleware} from './routes/webpack.js'


const app = express()
const PORT = process.env.port || 9031
const STATIC_FILES_DIRECTORY = path.join(__dirname,'../../client/static')

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
  done(null, user.email)
})

passport.deserializeUser((email, done) => {
  if (email==='demo@pokerface.io'){
    return done(null, {email,username:'deanshub'})
  }else{
    return done(null, false, {message: 'Email or password are Incorrect .'})
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
    return done(null, {email,username:'deanshub'})
  }else{
    return done(null, false, {message: 'Email or password are Incorrect .'})
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
    if (!user) { return res.status(403).json({error:'Email or password are Incorrect .'}) }
    req.logIn(user, (err) => {
      if (err) { return next(err) }
      return res.redirect('/')
      // return res.redirect(`/profile/${user.username}`)
    })
  })(req, res, next)
})

app.get('/logout', (req, res)=>{
  req.logout()
  res.redirect('/login')
})

function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()){
    return next()
  }
  res.redirect('/login')
}

app.get('/', isAuthenticated, (req, res)=>{
  res.sendFile(path.join(STATIC_FILES_DIRECTORY, 'index.html'))
})
app.get('/profile', isAuthenticated, (req, res)=>{
  res.sendFile(path.join(STATIC_FILES_DIRECTORY, 'index.html'))
})
app.get('/timer', isAuthenticated, (req, res)=>{
  res.sendFile(path.join(STATIC_FILES_DIRECTORY, 'index.html'))
})
app.get('/smart', isAuthenticated, (req, res)=>{
  res.sendFile(path.join(STATIC_FILES_DIRECTORY, 'index.html'))
})
app.get('/profile/:username', isAuthenticated, (req, res)=>{
  res.sendFile(path.join(STATIC_FILES_DIRECTORY, 'index.html'))
})
app.get('/pulse', isAuthenticated, (req, res)=>{
  res.sendFile(path.join(STATIC_FILES_DIRECTORY, 'index.html'))
})
app.get('/login', (req, res)=>{
  res.sendFile(path.join(STATIC_FILES_DIRECTORY, 'index.html'))
})

app.use('/graphql', graphql)
apiRoutes.then(routes=>{
  routes.forEach((route)=>{
    app.use('/api', route)
  })
})

app.use('/', express.static(STATIC_FILES_DIRECTORY))
// app.get('*', function (req, res) {
//   // and drop 'public' in the middle of here
//   res.sendFile(path.join(STATIC_FILES_DIRECTORY, 'index.html'))
// })

app.listen(PORT, ()=>{
  console.log(`Pokerface server listening on port ${PORT}`)
})
