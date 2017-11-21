import passport from 'passport'
import {Strategy as JwtStrategy, ExtractJwt} from 'passport-jwt'
import DB from '../data/db'
import config from 'config'
import {signTokenToUser} from '../utils/authUtils'
import {Strategy as FacebookStrategy} from 'passport-facebook'
import { download } from '../utils/diskWriting'
import uuidv1 from 'uuid/v1'
import {createPlayer} from '../data/helping/player'

// TODO merge with mailer.sj
const hostLocation = (config.NODE_ENV==='development')?
    `localhost:${config.PORT}`
  :
    'pokerface.io'

const initialize = () => {
  const initialize = passport.initialize()

  const cookieExtractor = (req) =>  {
    let  token = null
    if (req && req.cookies)
    {
      token = req.cookies['jwt-facebook']
    }
    return token
  }

  passport.use(
    new JwtStrategy({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req) => {
          let token = null
          if (req && req.headers)
          {
            token = req.headers.authorization
          }
          return token
        },
        cookieExtractor,
      ]),
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

  passport.use(new FacebookStrategy(
    {
      clientID: config.FACEBOOK_APP_ID,
      clientSecret: config.FACEBOOK_SECRET_ID,
      callbackURL: `http://${hostLocation}/login/facebook/callback`,
      profileFields: [
        'id',
        'email',
        'cover',
        'picture.width(240).height(240)',
        'name',
        'gender',
      ],
    },
    function(accessToken, refreshToken, profile, cb) {
      const {
        email,
        first_name:firstname,
        last_name:lastname,
        gender,
        picture,
        cover,
      } = profile._json

      DB.models.Player.findOne({email}).then((existedPlayer) => {

        if (existedPlayer){
          return existedPlayer
        }else {
          return createPlayer({email, firstname, lastname, gender})
        }
      }).then((player) => {

        const pictureUuid = uuidv1()

        if (!player.avatar){
          download(
            picture.data.url,
            '../client/static/images/avatars',
            `${pictureUuid}.jpg`,
            (err) => {
              if (!err){
                player.avatar = `avatars/${pictureUuid}.jpg`
                player.updated = Date.now()
                player.save()
              }else {
                console.error(err)
              }
            }
          )
        }

        if (!player.coverImage && cover){
          download(
            cover.source,
            '../client/static/images/covers',
            `${pictureUuid}.jpg`,
            (err) => {
              if (!err){
                player.coverImage = `covers/${pictureUuid}.jpg`
                player.updated = Date.now()
                player.save()
              }else {
                console.error(err)
              }
            }
          )
        }
        const token = signTokenToUser(player)

        return cb(null, {token, user:{...player.toJSON(), password:undefined}})
      }).catch(e=>{
        console.error(e)
        return cb(null, {user:{}})
      })
    }))


  passport.serializeUser((player, done) => {
    done(null, player.user._id)
  })

  passport.deserializeUser((user, done) => {
    DB.models.Player.findById(user).select('-password').then((user)=>{
      const token = signTokenToUser(user)
      return done(null, {token, user:{...user.toJSON(), fullname:user.fullname}})
    }).catch(e=>{
      console.error(e)
      return done(null, false, {message: 'Email or password are Incorrect .'})
    })
  })

  return initialize
}

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

    if (user && req.cookies['jwt-facebook']){
      req.refreshToken = req.cookies['jwt-facebook']
      res.clearCookie('jwt-facebook')
    }

    return next()
  })(req, res, next)
}

//'user_friends',
const facebookLogin = passport.authenticate('facebook', {scope: ['public_profile', 'email']})

const authenticateWithFacebook = passport.authenticate('facebook', { failureRedirect: '/login' })


export default {
  initialize,
  login,
  facebookLogin,
  authenticateWithFacebook,
  addUserToRequest,
}
