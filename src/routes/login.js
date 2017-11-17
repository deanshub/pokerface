import express from 'express'
import authentication from './authentication'

const router = express.Router()

router.post('/local', authentication.login)
router.get('/facebook', authentication.facebookLogin)
router.get('/facebook/callback', authentication.copyFacebookUser, (req, res) => {
  res.redirect('/')
})

router.post('/isAuthenticated', (req, res)=>{

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
    res.json({...req.user, username, avatar, coverImage})
  }
})

export default router
