import express from 'express'
import authentication from './authentication'

const TOKEN_EXPIRATION_DURATION = 1000*600

const prepareAvatar = (avatar, username) => {
  if (!avatar){
    return '/images/avatar.png'
  }else if (!avatar){
    return `/api/avatarGenerator?username=${username}`
  }else if (!avatar.includes('http')) {
    return `/images/${avatar}`
  }

  return avatar
}

const prepareCoverImage = (coverImage, username) => {
  if (!coverImage){
    return '/images/cover.jpg'
  }else if (!coverImage){
    return `/api/avatarGenerator?username=${username}`
  }else if (!coverImage.includes('http')) {
    return `/images/${coverImage}`
  }

  return coverImage
}

const router = express.Router()

router.post('/local', authentication.login)
router.get('/facebook', authentication.facebookLogin)
router.get('/googlepluse', authentication.googleLogin)

// authenticate with facebook to get the token
router.get('/facebook/callback', authentication.authenticateWithFacebook, (req, res) => {
  res.cookie('jwt', req.user.token, {maxAge:TOKEN_EXPIRATION_DURATION})
  res.redirect('/')
})

router.get('/googlepluse/callback', authentication.authenticateWithGoogle, (req, res) => {
  res.cookie('jwt', req.user.token, {maxAge:TOKEN_EXPIRATION_DURATION})
  res.redirect('/')
})

router.post('/isAuthenticated', authentication.addUserToRequest, (req, res)=>{
  if (!req.user) {
    res.json({user:{}})
  }else{
    const {username, organizations} = req.user

    let avatar = prepareAvatar(req.user.avatar, username)

    let coverImage = prepareCoverImage(req.user.coverImage, username)

    if (organizations){
      organizations.forEach(org => {
        org.avatar = prepareAvatar(org.avatar, org.username)
      })
    }

    const {email, fullname, firstname, lastname} = req.user
    const userToClient = {email, fullname, firstname, lastname, username, avatar, coverImage, organizations}

    res.json({user:userToClient})
  }
})

router.post('/switchToOrganization', authentication.addUserToRequest, authentication.switchToOrganization)

export default router
