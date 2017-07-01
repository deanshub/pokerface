import path from 'path'
import fs from 'fs'
import emailjs from 'emailjs'
import ical from './ical-generator'

// create reusable transporter object using the default SMTP transport
const server = emailjs.server.connect({
  user: process.env.GMAIL_USER,
  password: process.env.GMAIL_PASSWORD,
  host: 'smtp.gmail.com',
  ssl: true,
})
// setup email data with unicode symbols
const generalSignupMessage = {
  from: '"Pokerface.io" <support@pokerface.io>', // sender address
  // to: 'bar@blurdybloop.com, baz@blurdybloop.com', // list of receivers
  subject: 'Pokerface.io Signup ✔', // Subject line
  bcc: 'dean@pokerface.io',
  // text: 'Hello world ?', // plain text body
  // html: '<b>Hello world ?</b>' // html body
}

function removeFile(path){
  fs.unlink(path,(err)=>{
    if (err){
      console.error(err)
    }
  })
}

function sendPersonalGameInvite(email, game){
  return new Promise((resolve,reject)=>{
    const generalInviteMessage = {
      from: '"Pokerface.io" <support@pokerface.io>', // sender address
      subject: game.title||'Game Invitation', // Subject line
    }
    const htmlContent = `<div>You were invited to a game,</div>
    <div>${game.description||''}</div>
    <br/><br/>
    <small>For more information checkout <a href="http://pokerface.io/events">Pokerface.io</a></small>`

    const eventObj = {
      sequence: 0,
      start: game.from,
      end: game.to,
      summary: game.title||'Game Invitation',
      description: game.description,
      uid: game.id,
      organiser: {
        name: 'Pokerface.io',
        email: 'invite@pokerface.io',
      },
      location: game.location,
      method: 'PUBLISH',
    }
    let cal = ical().setDomain('http://pokerface.io').setName('Pokerface')
    cal.addEvent(eventObj)
    const eventPath = path.join(__dirname, `${game.id}.ics`)
    cal.saveSync(eventPath)

    const message = Object.assign({}, generalInviteMessage, {to:email, attachment:[{data:htmlContent, alternative:true}, {path:eventPath, type:'application/ics', name:'pokerface.ics', method:'PUBLISH'}]})

    server.send(message, (error, message) => {
      if (error) {
        reject(error)
        removeFile(eventPath)
      }else{
        // console.log(message)
        removeFile(eventPath)
        resolve({email,sucess:1})
      }
    })
  }).catch(err=>{
    console.error(err)
    return {email, sucess:0}
  })
}


export default {
  sendSignupMessage(firstName, lastName, email){
    const htmlContent = `<h3>Sorry ${firstName} ${lastName},</h3>
    <h4>Currently signup is via invitations only ☹</h4>
    <div>But don't worry, we added you to the waiting list,<br/>we will send you an invite as soon as we open pokerface.io to the public.</div>
    <br/>
    <div>Thank you for signing up and have a good day!</div>
    `
    const message = Object.assign({}, generalSignupMessage, {to:email, attachment:[{data:htmlContent, alternative:true}]})

    return new Promise((resolve, reject)=>{
      // send mail with defined transport object
      server.send(message, (error, message) => {
        if (error) {
          reject(error)
        }else{
          resolve(message)
        }
      })
    })
  },
  sendGameInvite(game, Db){
    Db.models.player.findAll({
      where:{
        username: {
          $in: [...game.invited, game.playerUsername],
        },
      },
    }).then(players=>{
      return Promise.all(players.map(player=>sendPersonalGameInvite(player.email, game)))
    })
  },
}
