import passport from 'passport'
import {Strategy as JwtStrategy, ExtractJwt} from 'passport-jwt'
import DB from '../data/db'
import config from 'config'
import {signTokenToUser} from '../utils/authUtils'
import {Strategy as FacebookStrategy} from 'passport-facebook'

const initialize = () => {
  const initialize = passport.initialize()

  passport.use(
    new JwtStrategy({
      jwtFromRequest: ExtractJwt.fromExtractors([(req) => {
        let token = null
        if (req && req.headers)
        {
          token = req.headers.authorization
        }
        return token
      }]),
      secretOrKey: config.SECRET_KEY,
    },
      function (jwtPayload, done){
        DB.models.Player.findById(jwtPayload.id).select('-password').then((user)=>{
          return done(null, {...user.toJSON(), fullname:user.fullname})
        }).catch(e=>{
          console.error(e)
          return done(null, false, {message: 'Wrong token was received'})
        })
      }
    )
  )

  passport.use(new FacebookStrategy({
    clientID: '471349949896195',
    clientSecret: '23da997ccb85a542a193b8cbac4a31dd',
    callbackURL: 'http://localhost:9031/login/facebook/callback',
    profileFields: [
      'id',
      'email',
      'cover',
      'picture.width(240).height(240)',
      'name',
      'gender',
      'birthday',
    ],
  },
    function(accessToken, refreshToken, profile, cb) {
      // In this example, the user's Facebook profile is supplied as the user
      // record.  In a production-quality application, the Facebook profile should
      // be associated with a user record in the application's database, which
      // allows for account linking and authentication with other identity
      // providers.
      return cb(null, profile)
    }))

  return initialize
}

passport.serializeUser(function(user, done) {
  done(null, user)
})

passport.deserializeUser(function(obj, done) {
  done(null, obj)
})

const login = (req, res) => {
  const {email, password} = req.body

  DB.models.Player.findOne({email,password,active:true}).select('-password').then((user)=>{
    if (!user){
      res.status(401).json({error: 'Email or password are Incorrect .'})
    } else{
      const token = signTokenToUser(user)
      res.json({token, user:{...user.toJSON(), fullname:user.fullname}})
    }
  }).catch(e=>{
    console.error(e)
    res.json(e)
  })
}

const addUserToRequest = (req, res, next) => {
  passport.authenticate('jwt', (err, user) => {
    if (err){
      console.error(err)
    }
    req.user = user
    return next()
  })(req, res, next)
}

//'user_friends',
const facebookLogin = passport.authenticate('facebook', {scope: ['public_profile', 'email']})

const copyFacebookUser = passport.authenticate('facebook', { failureRedirect: '/login' })


export default {
  initialize,
  login,
  facebookLogin,
  copyFacebookUser,
  addUserToRequest,
}
