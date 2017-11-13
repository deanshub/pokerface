import express from 'express'
import mailer from '../utils/mailer'
import DB from '../data/db'
import uuidv1 from 'uuid/v1'
import moment from 'moment'
import {signTokenToUser} from '../utils/authUtils'

const router = express.Router()

router.post('/signup', (req, res)=>{
  const {firstName, lastName, email} = req.body
  const uuid =  uuidv1()

  DB.models.Player.findOne({email}).select('active').then((user) => {
    if (user && user.active) {
      res.status(403).json({error:'Current email already existed.'})
    } else {

      // Add player to db
      new DB.models.Player({
        _id: `${firstName}.${lastName}`.toLowerCase(), // TODO add counter
        firstname:firstName,
        lastname:lastName,
        email: email.toLowerCase(),
        tempuuid:uuid,
        tempuuiddate: Date.now(),
      }).save().then(() => {
        return mailer.sendSignupMessage(firstName, lastName, email, uuid)
      }).then(() => {
        res.json({success:true})
      }).catch(err=>{
        console.log(err)
        res.status(500).json({error:err})
      })
    }
  }).catch(err=>{
    console.log(err)
    res.status(500).json({error:err})
  })
})

router.post('/forgotPassword', (req, res) => {
  const { email } = req.body
  const uuid =  uuidv1()

  // TODO Didn't select the password?
  DB.models.Player.findOne({email, active:true}).then((user) => {
    if (!user) {
      // If player not exists send OK but don't do any thing
      res.json({success:true})
    } else {
      const currentDate = Date.now()

      user.tempuuid = uuid
      user.tempuuiddate = currentDate
      user.updated = currentDate

      user.save().then((user) => {
        const {
          firstname,
          lastname,
          email,
          tempuuid,
        } = user

        // TODO the current catching error in mailer not enable to know error occurred
        return mailer.sendResetPasswordMessage(firstname, lastname, email, tempuuid)
      }).then(() => {
        res.json({success:true})
      }).catch(err=>{
        console.log(err)
        res.status(500).json({error:err})
      })
    }
  }).catch(err=>{
    console.log(err)
    res.status(500).json({error:err})
  })
})

router.post('/setPassword', (req, res) =>{
  const {uuid, password} = req.body

  DB.models.Player.findOne({tempuuid:uuid}).select('-password').then((user) => {

    // if user not found of the time to set password has expired.
    if (!user || moment() > moment(user.tempguiddate).add(15, 'minutes')) {
      res.json({success:false})
    }else{
      user.tempuuid = undefined
      user.tempuuiddate = undefined
      user.active = true
      user.password = password
      user.updated = Date.now()

      return user.save()
    }
  }).then((user) => {
    if (user) {
      const token = signTokenToUser(user)
      res.json({success:true, token})
    }
  }).catch(err=>{
    res.json({error:err})
  })
})


// TODO find other place
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
