import passport from 'passport'
import {Strategy as JwtStrategy, ExtractJwt} from 'passport-jwt'
import DB from '../data/db'
import config from 'config'
import {signTokenToUser} from '../utils/authUtils'
import {Strategy as FacebookStrategy} from 'passport-facebook'
import {Strategy as GoogleStrategy} from 'passport-google-oauth20'
import { download } from '../utils/diskWriting'
import uuidv1 from 'uuid/v1'
import {
  createUser,
  findPlayerWithOrganizations,
  findPlayerWithOrganizationsById ,
  loginPermissionFilter,
} from '../data/helping/user'


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

        DB.models.User.findOne({_id:username,password}).then((user)=>{
          if (!user){
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

      DB.models.User.findOne({email, organization:{$ne:true}}).then((existedUser) => {

        if (existedUser){
          return existedUser
        } else {
          return createUser({email, firstname, lastname, gender})
        }
      }).then((user) => {

        const pictureUuid = uuidv1()

        if (!user.facebookId){
          user.facebookId = facebookId
        }

        if (!user.avatar){

          const avatarFilename = `avater${pictureUuid}.jpg`
          download(
            picture.data.url,
            '../client/static/images',
            avatarFilename,
          ).then(() => {
            user.avatar = avatarFilename
            user.updated = Date.now()
            user.save()
          }).catch((err) => {
            console.error(err)
          })
        }

        if (!user.coverImage && cover){

          const coverFileName = `cover${pictureUuid}.jpg`
          download(
            cover.source,
            '../client/static/images',
            coverFileName,
          ).then(() => {
            user.coverImage = coverFileName
            user.updated = Date.now()
            user.save()
          }).catch((err) => {
            console.error(err)
          })
        }

        // Add the related organizations
        const player = user.toJSON()
        return loginPermissionFilter(DB.models.User.find({players:player.id})).count().then((count) =>{
          player.organizations = count
          return player
        })
      }).then((user) => {
        const token = signTokenToUser(user)
        return cb(null, {token, user})
      }).catch(e=>{
        console.error(e)
        return cb(null, {user:{}})
      })
    }))

  passport.use(new GoogleStrategy({
    clientID: config.GOOGLE_APP_ID,
    clientSecret: config.GOOGLE_SECRET_ID,
    callbackURL: `http://${hostLocation}/login/googleplus/callback`,
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

      DB.models.User.findOne({email, organization:{$ne:true}}).then((existedUser) => {

        if (existedUser){
          return existedUser
        }else {
          return createUser({
            email,
            firstname:name.givenName,
            lastname:name.familyName,
            gender,
          })
        }
      }).then((user) => {

        if (!user.googleId){
          user.googleId = googleId
          user.save()
        }

        const pictureUuid = uuidv1()

        if (!user.coverImage && cover){

          const coverFileName = `cover${pictureUuid}.jpg`
          download(
            cover.coverPhoto.url,
            '../client/static/images',
            coverFileName,
          ).then(() => {
            user.coverImage = coverFileName
            user.updated = Date.now()
            user.save()
          }).catch((err) => {
            console.error(err)
          })
        }

        // Add the related organizations
        const player = user.toJSON()
        return loginPermissionFilter(DB.models.User.find({players:player.id})).count().then((count) =>{
          player.organizations = count
          return player
        })
      }).then((user) => {
        const token = signTokenToUser(user)
        return cb(null, {token, user})
      }).catch(e=>{
        console.error(e)
        return cb(null, {user:{}})
      })
    }))

  passport.serializeUser((payload, done) => {
    done(null, payload.user.id)
  })

  passport.deserializeUser((userId, done) => {
    findPlayerWithOrganizationsById(userId).then((user)=>{
      const token = signTokenToUser(user)
      return done(null, {token, user})
    }).catch(e=>{
      console.error(e)
      return done(null, false, {message: 'Email or password are Incorrect .'})
    })
  })

  return initialize
}

const login = (req, res, next) => {
  const {email, password} = req.body

  findPlayerWithOrganizations({email,password,active:true}).then((user)=>{
    if (!user){
      res.status(401).json({error: 'Email or password are Incorrect .'})
    } else{
      const token = signTokenToUser(user)
      req.loginUser = {user, token}

      return next()
    }
  }).catch(e=>{
    console.error(e)
    res.json(e)
  })
}

const switchToUser = (req, res) => {
  const {user:currentUser} = req
  const {userId} = req.body

  if (currentUser.id === userId){
    const token = signTokenToUser(currentUser)
    return res.json({token})
  }

  loginPermissionFilter(DB.models.User.findById(userId).where({players:currentUser.id})).then((organization) => {
    if (!organization){
      res.status(401).json({error: 'Organization is not allowed to player'})
    }else{
      // Organization don't have passowrd so we need only the id (unsername) for signing
      const token = signTokenToUser(organization.toJSON())
      res.json({token})
    }
  }).catch((err) => {
    res.status(500).json({error:err})
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
  switchToUser,
}
