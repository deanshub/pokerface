import passport from 'passport'
import {Strategy as JwtStrategy, ExtractJwt} from 'passport-jwt'
import DB from '../data/db'
import config from 'config'
import {signTokenToUser} from '../utils/authUtils'
import {Strategy as FacebookStrategy} from 'passport-facebook'
import {Strategy as GoogleStrategy} from 'passport-google-oauth20'
import { download } from '../utils/diskWriting'
import uuidv1 from 'uuid/v1'
import {createPlayer} from '../data/helping/player'

// TODO merge with mailer.sj
const hostLocation = (config.NODE_ENV==='development')?
    `localhost:${config.PORT}`
  :
    'pokerface.io'

const AVATAR_SIZE = 240

const initialize = () => {
  const initialize = passport.initialize()

  const cookieExtractor = (req) =>  {
    let  token = null
    if (req && req.cookies)
    {
      token = req.cookies['jwt']
    }
    return token
  }

  passport.use(
    new JwtStrategy({
      jwtFromRequest: ExtractJwt.fromExtractors([
        cookieExtractor,
        (req) => {
          let token = null
          if (req && req.headers)
          {
            token = req.headers.authorization
          }
          return token
        },
      ]),
      secretOrKey: config.JWT_SECRET_KEY,
    },
      function ({username, password}, done){
        DB.models.Player.findById(username).then((user)=>{
          if (!user || user.password !== password){
            return done(null, false, {message: 'Wrong token was received'})
          }

          return done(null, {...user.toJSON()})
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
        `picture.width(${AVATAR_SIZE}).height(${AVATAR_SIZE})`,
        'name',
        'gender',
      ],
    },
    function(accessToken, refreshToken, profile, cb) {
      const {
        id:facebookId,
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
        } else {
          return createPlayer({email, firstname, lastname, gender})
        }
      }).then((player) => {

        const pictureUuid = uuidv1()

        if (!player.facebookId){
          player.facebookId = facebookId
        }

        if (!player.avatar){

          const avatarFilename = `avater${pictureUuid}.jpg`
          download(
            picture.data.url,
            '../client/static/images',
            avatarFilename,
          ).then(() => {
            player.avatar = avatarFilename
            player.updated = Date.now()
            player.save()
          }).catch((err) => {
            console.error(err)
          })
        }

        if (!player.coverImage && cover){

          const coverFileName = `cover${pictureUuid}.jpg`
          download(
            cover.source,
            '../client/static/images',
            coverFileName,
          ).then(() => {
            player.coverImage = coverFileName
            player.updated = Date.now()
            player.save()
          }).catch((err) => {
            console.error(err)
          })
        }
        const token = signTokenToUser(player)

        return cb(null, {token, user:{...player.toJSON()}})
      }).catch(e=>{
        console.error(e)
        return cb(null, {user:{}})
      })
    }))

  passport.use(new GoogleStrategy({
    clientID: config.GOOGLE_APP_ID,
    clientSecret: config.GOOGLE_SECRET_ID,
    callbackURL: `http://${hostLocation}/login/googlepluse/callback`,
  },
    function(accessToken, refreshToken, profile, cb) {

      const {
        id:googleId,
        name,
        gender,
        emails,
        //image:avatar,
        cover,
      } = profile._json

      const email = emails[0].value

      DB.models.Player.findOne({email}).then((existedPlayer) => {

        if (existedPlayer){
          return existedPlayer
        }else {
          return createPlayer({
            email,
            firstname:name.givenName,
            lastname:name.familyName,
            gender,
          })
        }
      }).then((player) => {

        if (!player.googleId){
          player.googleId = googleId
          player.save()
        }

        const pictureUuid = uuidv1()

        // TODO try to check anonimic picture
        // if (!player.avatar){
        //   // replace size parameter, search 'sz' after ?
        //   const avatarUrl = avatar.url.replace(/(sz=\d+$)(?=\\?)/g, `sz=${AVATAR_SIZE}`)
        //
        //   const avatarFilename = `avater${pictureUuid}.jpg`
        //   download(
        //     avatarUrl,
        //     '../client/static/images',
        //     avatarFilename,
        //   ).then(() => {
        //     player.avatar = avatarFilename
        //     player.updated = Date.now()
        //     player.save()
        //   }).catch((err) => {
        //     console.error(err)
        //   })
        // }

        if (!player.coverImage && cover){

          const coverFileName = `cover${pictureUuid}.jpg`
          download(
            cover.coverPhoto.url,
            '../client/static/images',
            coverFileName,
          ).then(() => {
            player.coverImage = coverFileName
            player.updated = Date.now()
            player.save()
          }).catch((err) => {
            console.error(err)
          })
        }

        const token = signTokenToUser(player)

        return cb(null, {token, user:{...player.toJSON()}})
      }).catch(e=>{
        console.error(e)
        return cb(null, {user:{}})
      })
    }))

  passport.serializeUser((player, done) => {
    done(null, player.user._id)
  })

  passport.deserializeUser((user, done) => {
    DB.models.Player.findById(user).then((user)=>{
      const token = signTokenToUser(user)
      return done(null, {token, user:{...user.toJSON()}})
    }).catch(e=>{
      console.error(e)
      return done(null, false, {message: 'Email or password are Incorrect .'})
    })
  })

  return initialize
}

const login = (req, res) => {
  const {email, password} = req.body

  DB.models.Player.findOne({email,password,active:true}).then((user)=>{
    if (!user){
      res.status(401).json({error: 'Email or password are Incorrect .'})
    } else{
      const token = signTokenToUser(user)
      res.json({token})
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

const facebookLogin = passport.authenticate('facebook', {scope: ['public_profile', 'email']})

const authenticateWithFacebook = passport.authenticate('facebook', { failureRedirect: '/login' })

const googleLogin = passport.authenticate('google', { scope: ['profile','email'] })

const authenticateWithGoogle = passport.authenticate('google', { failureRedirect: '/login' })

export default {
  initialize,
  login,
  facebookLogin,
  authenticateWithFacebook,
  addUserToRequest,
  googleLogin,
  authenticateWithGoogle,
}
