import express from 'express'
import mailer from '../utils/mailer'
import DB from '../data/db'
import uuidv1 from 'uuid/v1'
import moment from 'moment'
import {signTokenToUser} from '../utils/authUtils'
import {createPlayer} from '../data/helping/player'

const MINUTES_UUID_EXPIRATION = 15

function KnownError(status, response){
  this.status = status
  this.response = response
}

const router = express.Router()

router.post('/signup', (req, res)=>{
  const {firstName, lastName, email} = req.body
  const uuid =  uuidv1()

  DB.models.Player.findOne({email}).select('active').then((player) => {
    if (player && player.active) {
      throw new KnownError(403, {error:'Current email already existes.'})
    }else if (player){
      const currentDate = Date.now()

      player.firstname = firstName
      player.lastname = lastName
      player.tempuuid = uuid
      player.tempuuiddate = currentDate
      player.updated = currentDate
      return player.save()
    }

    const newPlayer = {
      email:email.toLowerCase(),
      firstname:firstName,
      lastname:lastName,
      tempuuid:uuid,
      tempuuiddate: Date.now(),
    }
    return createPlayer(newPlayer)
  }).then(() => {
    return mailer.sendSignupMessage(firstName, lastName, email, uuid)
  }).then(() => {
    res.json({success:true})
  }).catch(err=>{
    console.error(err)
    if (err instanceof KnownError){
      res.status(err.status).json(err.response)
    }else{
      res.status(500).json({error:err})
    }
  })
})

router.post('/forgotPassword', (req, res) => {
  const { email } = req.body
  const uuid =  uuidv1()

  // TODO Didn't select the password?
  DB.models.Player.findOne({email, active:true}).then((player) => {
    if (!player) {
      // If player not exists send OK but don't do any thing
      throw new KnownError(20, {success:true})
    }
    return player
  }).then((player) => {
    // Update the player's documant
    const currentDate = Date.now()

    player.tempuuid = uuid
    player.tempuuiddate = currentDate
    player.updated = currentDate
    return player.save()
  }).then((player) => {
    // Send mail to the player
    const {
      firstname,
      lastname,
      email,
      tempuuid,
    } = player

    // TODO the current catching error in mailer not enable to know error occurred
    return mailer.sendResetPasswordMessage(firstname, lastname, email, tempuuid)
  }).then(() => {
    res.json({success:true})
  }).catch(err=>{
    console.error(err)

    if (err instanceof KnownError){
      res.status(err.status).json(err.response)
    }else{
      res.status(500).json({error:err})
    }
  })
})

router.post('/setPassword', (req, res) =>{
  const {uuid, password} = req.body

  DB.models.Player.findOne({tempuuid:uuid}).then((player) => {

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

export default router
