import express from 'express'
import mailer from '../utils/mailer'
const router = express.Router()

router.post('/signup', (req, res)=>{
  const {firstName, lastName, email} = req.body
  mailer.sendSignupMessage(firstName, lastName, email)
  .then(message=>{
    console.log('Message %s sent', message)
    res.json({sucess:true})
  })
  .catch(err=>{
    console.log(err)
    res.json({error:err})
  })
})

export default router
