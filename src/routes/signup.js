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
  if (req.isAuthenticated()){
    const username = req.user._id

    let avatar = req.user.avatar
    if (!avatar){
      avatar = `/api/avatarGenerator?username=${username}`
    }else if (!avatar.includes('http')) {
      avatar = `/images/${avatar}`
    }
    res.json({...req.user, username, avatar})
  }else{
    res.json({})
  }
})

export default router
