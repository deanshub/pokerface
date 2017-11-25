import express from 'express'
import authentication from './authentication'

const router = express.Router()

router.post('/local', authentication.login)
router.get('/facebook', authentication.facebookLogin)
router.get('/googlepluse', authentication.googleLogin)

// authenticate with facebook to get the token
router.get('/facebook/callback', authentication.authenticateWithFacebook, (req, res) => {
  res.cookie('jwt', req.user.token, {maxAge:1000*600})
  res.redirect('/')
})

router.get('/googlepluse/callback', authentication.authenticateWithGoogle, (req, res) => {
  res.cookie('jwt', req.user.token, {maxAge:1000*600})
  res.redirect('/')
})



router.post('/isAuthenticated', authentication.addUserToRequest, (req, res)=>{

  if (!req.user) {
    res.json({})
  }else{
    const username = req.user._id

    let avatar = req.user.avatar
    if (!avatar && !username){
      return '/images/avatar.png'
    }else if (!avatar){
      avatar = `/api/avatarGenerator?username=${username}`
    }else if (!avatar.includes('http')) {
      avatar = `/images/${avatar}`
    }

    let coverImage = req.user.coverImage
    if (!coverImage && !username){
      return '/images/cover.jpg'
    }else if (!coverImage){
      coverImage = `/api/avatarGenerator?username=${username}`
    }else if (!coverImage.includes('http')) {
      coverImage = `/images/${coverImage}`
    }

    const refreshToken = req.refreshToken
    const {email, fullname, firstname, lastname} = req.user
    const userToClient = {email, fullname, firstname, lastname, username, avatar, coverImage}

    res.json({refreshToken, user:userToClient})
  }
})

export default router
