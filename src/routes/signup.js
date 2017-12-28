import express from 'express'
import mailer from '../utils/mailer'
import DB from '../data/db'
import uuidv1 from 'uuid/v1'
import moment from 'moment'
import {signTokenToUser} from '../utils/authUtils'
import {createUser} from '../data/helping/User'

const MINUTES_UUID_EXPIRATION = 15

function KnownError(status, response){
  this.status = status
  this.response = response
}

const router = express.Router()

router.post('/signup', (req, res)=>{
  const {firstName, lastName, email} = req.body
  const uuid =  uuidv1()

  DB.models.User.findOne({email, organization:{$ne:true}}).select('active').then((user) => {
    if (user && user.active) {
      throw new KnownError(403, {error:'Current email already existes.'})
    }else if (user){
      const currentDate = Date.now()

      user.firstname = firstName
      user.lastname = lastName
      user.tempuuid = uuid
      user.tempuuiddate = currentDate
      user.updated = currentDate
      return user.save()
    }

    const newUser = {
      email:email.toLowerCase(),
      firstname:firstName,
      lastname:lastName,
      tempuuid:uuid,
      tempuuiddate: Date.now(),
    }
    return createUser(newUser)
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
  DB.models.User.findOne({email, active:true}).then((user) => {
    if (!user) {
      // If user not exists send OK but don't do any thing
      throw new KnownError(20, {success:true})
    }
    return user
  }).then((user) => {
    // Update the user's documant
    const currentDate = Date.now()

    user.tempuuid = uuid
    user.tempuuiddate = currentDate
    user.updated = currentDate
    return user.save()
  }).then((user) => {
    // Send mail to the user
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

  DB.models.User.findOne({tempuuid:uuid}).then((user) => {

    const currnetTime = moment()
    const expirationTime = moment(user.tempguiddate).add(MINUTES_UUID_EXPIRATION, 'minutes')

    // if user not found of the time to set password has expired.
    if (!user || currnetTime > expirationTime) {
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
      res.json({success:true, token, email:user.email})
    }
  }).catch(err=>{
    res.json({error:err})
  })
})

export default router
