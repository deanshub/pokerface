import express from 'express'
import mailer from '../utils/mailer'

const router = express.Router()

router.post('/signup', (req, res)=>{
  const {firstname, lastName, email} = req.body
  mailer.sendSignupMessage(firstname, lastName, email)
  .then(message=>{
    console.log('Message %s sent', message)
    res.json({sucess:true})
  })
  .catch(err=>{
    console.log(err)
    res.json({error:err})
  })
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
