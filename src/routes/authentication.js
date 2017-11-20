import passport from 'passport'
import {Strategy as JwtStrategy, ExtractJwt} from 'passport-jwt'
import DB from '../data/db'
import config from 'config'
import {signTokenToUser} from '../utils/authUtils'
import {Strategy as FacebookStrategy} from 'passport-facebook'

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
      const {_json:fbUser} = profile

      const player = {
        _id: `${fbUser.first_name}.${fbUser.last_name}`.toLowerCase(), // TODO add counter
        email:fbUser.email,
        firstname:fbUser.first_name,
        lastname:fbUser.last_name,
        gender:fbUser.gender,
        //birthday:moment(fbUser.birthday, 'MM/DD/YYYY'),
        updated:Date.now(),
      }

      DB.models.Player.findOneAndUpdate(
        {email:player.email},
        player,
        {new:true,upsert:true},
      ).then((player) => {

        // TODO check what happens if there is no picture
        if (fbUser.picture.data){
          player.avatar = fbUser.picture.data.url
        }

        if (fbUser.cover.source){
          player.avatar = fbUser.picture.data.url
        }
        const token = signTokenToUser(player)
        player.save()

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
