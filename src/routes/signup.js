import express from 'express'
import mailer from '../utils/mailer'
import DB from '../data/db'
import uuidv1 from 'uuid/v1'
import moment from 'moment'
import {signTokenToUser} from '../utils/authUtils'

const MINUTES_UUID_EXPIRATION = 15

const router = express.Router()

router.post('/signup', (req, res)=>{
  const {firstName, lastName, email} = req.body
  const uuid =  uuidv1()

  DB.models.Player.findOne({email}).select('active').then((player) => {
    if (player && player.active) {
      res.status(403).json({error:'Current email already existes.'})
    }
    return player
  }).then((player) => {
    // Add player to db
    if (!player){
      return new DB.models.Player({
        _id: `${firstName}.${lastName}`.toLowerCase(), // TODO add counter
        firstname:firstName,
        lastname:lastName,
        email: email.toLowerCase(),
        tempuuid:uuid,
        tempuuiddate: Date.now(),
      }).save()
    }
  }).then((player) => {
    if (player){
      return mailer.sendSignupMessage(firstName, lastName, email, uuid)
    }
  }).then((mailRes) => {
    if (mailRes){
      res.json({success:true})
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
  DB.models.Player.findOne({email, active:true}).then((player) => {
    if (!player) {
      // If player not exists send OK but don't do any thing
      res.json({success:true})
    }
    return player
  }).then((player) => {
    // Update the player's documant
    if (player){
      const currentDate = Date.now()

      player.tempuuid = uuid
      player.tempuuiddate = currentDate
      player.updated = currentDate
      return player.save()
    }
  }).then((player) => {
    // Send mail to the player
    if (player){
      const {
        firstname,
        lastname,
        email,
        tempuuid,
      } = player

      // TODO the current catching error in mailer not enable to know error occurred
      return mailer.sendResetPasswordMessage(firstname, lastname, email, tempuuid)
    }
  }).then((mailRes) => {
    if (mailRes){
      res.json({success:true})
    }
  }).catch(err=>{
    console.log(err)
    res.status(500).json({error:err})
  })
})

router.post('/setPassword', (req, res) =>{
  const {uuid, password} = req.body

  DB.models.Player.findOne({tempuuid:uuid}).select('-password').then((player) => {

    const currnetTime = moment()
    const expirationTime = moment(player.tempguiddate).add(MINUTES_UUID_EXPIRATION, 'minutes')

    // if player not found of the time to set password has expired.
    if (!player || currnetTime > expirationTime) {
      res.json({success:false})
    }else{
      player.tempuuid = undefined
      player.tempuuiddate = undefined
      player.active = true
      player.password = password
      player.updated = Date.now()

      return player.save()
    }
  }).then((player) => {
    if (player) {
      const token = signTokenToUser(player)
      res.json({success:true, token, email:player.email})
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
