import express from 'express'
import authentication from './authentication'
import {prepareAvatar, prepareCoverImage, prepareRebrandingDetails} from '../data/helping/user'
import {CREATE_PUBLIC_EVENT} from '../utils/permissions'

const TOKEN_EXPIRATION_DURATION = 1000*600

const PERMISSIONS_TO_CLIENT = [CREATE_PUBLIC_EVENT]

const prepareUserToClient = (user) => {

  const {
    username,
    email,
    fullname,
    firstname,
    lastname,
    organizations,
    permissions,
    rebrandingDetails,
  } = user

  const avatar = prepareAvatar(user)
  const coverImage = prepareCoverImage(user.coverImage)
  const newDetails =  prepareRebrandingDetails(permissions, rebrandingDetails, user.avatar, fullname)

  const permissionsToClient = permissions && permissions.filter(permission => PERMISSIONS_TO_CLIENT.includes(permission))

  const userToClient = {
    email,
    fullname,
    firstname,
    lastname,
    username,
    avatar,
    coverImage,
    organizations,
    rebrandingDetails:newDetails,
    permissions:permissionsToClient,
  }

  return  userToClient
}

const redirectExternalLogin = ((req, res) => {
  const {user, token} = req.user
  res.cookie('jwt', token, {maxAge:TOKEN_EXPIRATION_DURATION})

  const url = (user.organizations > 0)?'/login?selectuser=true':'/'

  res.redirect(url)
})

const router = express.Router()

router.post('/local', authentication.login, (req, res) => {

  const {user, token} = req.loginUser
  const userToClient= prepareUserToClient(user)
  res.json({user:userToClient, token})
})
router.get('/facebook', authentication.facebookLogin)
router.get('/googleplus', authentication.googleLogin)

// authenticate with facebook to get the token
router.get('/facebook/callback', authentication.authenticateWithFacebook, redirectExternalLogin)

router.get('/googleplus/callback', authentication.authenticateWithGoogle, redirectExternalLogin)

router.post('/isAuthenticated', authentication.addUserToRequest, (req, res)=>{
  if (!req.user) {
    res.json({user:{}})
  }else{
    const userToClient= prepareUserToClient(req.user)
    res.json({user:userToClient})
  }
})

router.post('/switchToUser', authentication.addUserToRequest, authentication.switchToUser)

export default router