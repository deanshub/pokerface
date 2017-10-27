import passport from 'passport'
import {Strategy as JwtStrategy, ExtractJwt} from 'passport-jwt'
import jwt  from 'jsonwebtoken'
import DB from '../data/db'
import {COOKIE_TOKEN_NAME} from '../utils/authUtils'
import config from 'config'

const initialize = () => {
  const initialize = passport.initialize()

  passport.use(
    new JwtStrategy({
      jwtFromRequest: ExtractJwt.fromExtractors([(req) => {
        let token = null
        if (req && req.cookies)
        {
          token = req.cookies[COOKIE_TOKEN_NAME]
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

  return initialize
}

const login = (req, res) => {

  const {email, password} = req.body

  DB.models.Player.findOne({email,password}).select('-password').then((user)=>{
    const token = jwt.sign({id: user._id}, config.SECRET_KEY)
    res.json({token, user:{...user.toJSON(), fullname:user.fullname}})
  }).catch(e=>{
    console.error(e)
    res.status(401).json({message: 'Email or password are Incorrect .'})
  })
}

const addUserToRequest = (req, res, next) => {
  passport.authenticate(COOKIE_TOKEN_NAME, (err, user) => {
    if (err){
      console.log(err)
    }
    req.user = user
    return next()
  })(req, res, next)
}

const logout = (req, res, next)=>{
  res.cookie(COOKIE_TOKEN_NAME, '')
  return next()
}

const allFunctions = {
  initialize,
  login,
  addUserToRequest,
  logout,
}

export default allFunctions
