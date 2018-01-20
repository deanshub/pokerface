import emailjs from 'emailjs'
import icalToolkit from 'ical-toolkit'
import config from 'config'
import {getSendableInviteds} from '../data/helping/event'

const devEnvironment = (config.NODE_ENV==='development')

const hostLocation = devEnvironment?
    `localhost:${config.PORT}`
  :
    'pokerface.io'

const sendMailFlag = !config.DISABLE_SENDING_MAIL
// create reusable transporter object using the default SMTP transport
const server = emailjs.server.connect({
  user: config.GMAIL_USER,
  password: config.GMAIL_PASSWORD,
  host: 'smtp.gmail.com',
  ssl: true,
})
// setup email data with unicode symbols
const generalSignupMessage = {
  from: '"Pokerface.io" <support@pokerface.io>', // sender address
  // to: 'bar@blurdybloop.com, baz@blurdybloop.com', // list of receivers
  subject: 'Pokerface.io Signup ✔', // Subject line
  bcc: 'support@pokerface.io',
  // text: 'Hello world ?', // plain text body
  // html: '<b>Hello world ?</b>' // html body
}

function generateIcs(game, cancel=false){
  let builder = icalToolkit.createIcsFileBuilder()
  builder.throwError = true
  builder.ignoreTZIDMismatch = true
  builder.calname = 'Pokerface.io'

  //Cal timezone 'X-WR-TIMEZONE' tag. Optional. We recommend it to be same as tzid.
  builder.timezone = 'asia/jerusalem'

  //Time Zone ID. This will automatically add VTIMEZONE info.
  builder.tzid = 'asia/jerusalem'

  //Method
  builder.method = cancel?'CANCEL':'REQUEST'

  //Add events
  builder.events.push({

    //Event start time, Required: type Date()
    start: game.startDate,

    //Event end time, Required: type Date()
    end: game.endDate,

    //transp. Will add TRANSP:OPAQUE to block calendar.
    transp: 'OPAQUE',

    //Event summary, Required: type String
    summary: game.title||'Game Invitation',

    //All Optionals Below

    //Alarms, array in minutes
    alarms: [120, 15],

    // //Optional: If you need to add some of your own tags
    // additionalTags: {
    //   'SOMETAG': 'SOME VALUE'
    // },

    //Event identifier, Optional, default auto generated
    uid: game._id,

    // //Optional, The sequence number in update, Default: 0
    // sequence: null,

    // //Optional if repeating event
    // repeating: {
    //   freq: 'DAILY',
    //   count: 10,
    //   interval: 10,
    //   until: new Date()
    // },

    // //Optional if all day event
    // allDay: true,

    //Creation timestamp, Optional.
    stamp: new Date(),

    // //Optional, floating time.
    // floating: false,

    //Location of event, optional.
    location: game.location,

    //Optional description of event.
    description: game.description,

    //Optional Organizer info
    organizer: {
      name: 'Pokerface.io',
      email: 'invite@pokerface.io',
      // sentBy: 'person_acting_on_behalf_of_organizer@email.com' //OPTIONAL email address of the person who is acting on behalf of organizer.
    },

    // //Optional attendees info
    // attendees: [
    //   {
    //     name: 'A1', //Required
    //     email: 'a1@email.com', //Required
    //     status: 'TENTATIVE', //Optional
    //     role: 'REQ-PARTICIPANT', //Optional
    //     rsvp: true //Optional, adds 'RSVP=TRUE' , tells the application that organiser needs a RSVP response.
    //   },
    //   {
    //     name: 'A2',
    //     email: 'a2@email.com'
    //   }
    // ]

    //What to do on addition
    method: cancel?'CANCEL':'REQUEST',

    //Status of event
    status: cancel?'CANCELLED':'CONFIRMED',

    //Url for event on core application, Optional.
    url: 'http://pokerface.io',
  })

  // //Optional tags on VCALENDAR level if you intent to add. Optional field
  // builder.additionalTags = {
  //   'SOMETAG': 'SOME VALUE'
  // };

  return builder
}

function sendMessage(email, message){
  return new Promise((resolve,reject)=>{
    if (!sendMailFlag){
      resolve({email,sucess:1})
    }else{
      server.send(message, (error) => {
        if (error) {
          reject(error)
        }else{
          resolve({email,sucess:1})
        }
      })
    }
  }).catch(err=>{
    console.error(err)
    return {email, sucess:0}
  })
}

function sendPersonalEventInvite(organizer, game, player){
  const email = player.email
  const newPlayer = player.new
  const organization = player.organization?` (via ${organization})`:''

  const generalInviteMessage = {
    from: '"Pokerface.io" <support@pokerface.io>', // sender address
    subject: game.title||'Game Invitation', // Subject line
  }
  const htmlContent = `<div>${organizer.fullname} invited you ${organization} to a game.</div>
  <br/>
  <div>${game.description||''}</div>
  <br/><br/>
  <div>${newPlayer?'You are not a registered user, if you wish to RSVP please signup at <a href="http://pokerface.io/login">Pokerface.io</a>':'Please RSVP at <a href="http://pokerface.io/events">Pokerface.io</a>'}</div>
  <br/><br/><br/>
  <small>For more information checkout <a href="http://pokerface.io/events">Pokerface.io</a></small>`

  const ics = generateIcs(game)
  const message = Object.assign({}, generalInviteMessage, {to:email, attachment:[{data:htmlContent, alternative:true}, {data:ics.toString(), type:'application/ics', name:'pokerface.ics', method:'REQUEST'}]})

  if (devEnvironment){
    console.log(`Send mail of invitation to event to ${player.email}`)
  }

  return sendMessage(email, message)
}

function sendPersonalEventCancellation(organizer, game, player){
  const email = player.email
  const newPlayer = player.new

  const generalCancelMessage = {
    from: '"Pokerface.io" <support@pokerface.io>', // sender address
    subject: game.title?`${game.title} Cancelled`:'Game Cancelled', // Subject line
  }
  const htmlContent = `<div>${organizer.fullname} canelled the game.</div>
  <br/><br/>
  <div>${newPlayer?'You\'re not a registered user, if you wish to register please signup at <a href="http://pokerface.io/login">Pokerface.io</a>':''}</div>
  <br/><br/><br/>
  <small>For more information checkout <a href="http://pokerface.io/events">Pokerface.io</a></small>`

  const ics = generateIcs(game, true)
  const message = Object.assign({}, generalCancelMessage, {to:email, attachment:[{data:htmlContent, alternative:true}, {data:ics.toString(), type:'application/ics', name:'pokerface.ics', method:'CANCEL'}]})

  if (devEnvironment){
    console.log(`supposed send mail of cancel event to ${player.email}`)
  }

  return sendMessage(email, message)
}

function sendPersonalEventUpdate(organizer, game, player){
  const email = player.email
  const newPlayer = player.new
  const organization = player.organization?` (via ${organization})`:''

  const generalInviteMessage = {
    from: '"Pokerface.io" <support@pokerface.io>', // sender address
    subject: game.title||'Game Invitation Updating', // Subject line
  }
  const htmlContent = `<div>${organizer.fullname} update the game you are invited organization.</div>
  <br/>
  <div>${game.description||''}</div>
  <br/><br/>
  <div>${newPlayer?'You are not a registered user, if you wish to RSVP please signup at <a href="http://pokerface.io/login">Pokerface.io</a>':'Please RSVP at <a href="http://pokerface.io/events">Pokerface.io</a>'}</div>
  <br/><br/><br/>
  <small>For more information checkout <a href="http://pokerface.io/events">Pokerface.io</a></small>`

  const ics = generateIcs(game)
  const message = Object.assign({}, generalInviteMessage, {to:email, attachment:[{data:htmlContent, alternative:true}, {data:ics.toString(), type:'application/ics', name:'pokerface.ics', method:'REQUEST'}]})

  if (devEnvironment){
    console.log(`supposed send mail of update event to ${player.email}`)
  }
  return sendMessage(email, message)
}

function sendSignupMessage(firstname, lastname, email, uuid){
  const htmlContent = `<h3>Hello ${firstname} ${lastname},</h3>
  <p style="font-size: larger">Thank you for signing up to social platform pokerface.</p>
  <p style="font-size: larger">
    Click
    <b> <a href="http://${hostLocation}/password/${uuid}">here</a> </b>
    to set a password and start communicate with other poker players.
  </p>
  <h1 style="align-items:center;height:80px;display:flex;">
    <img src="http://pokerface.io/images/logo.png" style="height: inherit; "/>
    <div style="text-align: center;padding-left: .75rem; color: black;">
      <div style="font-size: xx-large;">Pokerface.io
        <div style="font-size: medium; font-weight: normal; ">Social platform for Poker players</div>
      </div>
    </div>
  </h1>
  `
  const message = Object.assign({}, generalSignupMessage, {to:email, attachment:[{data:htmlContent, alternative:true}]})

  return sendMessage(email, message)
}

function sendResetPasswordMessage(firstname, lastname, email, uuid){
  const htmlContent = `<h3>Hello ${firstname} ${lastname},</h3>
  <p style="font-size: larger">You propbably have a bad memory so you forgot your password to Pokerface.</p>
  <p style="font-size: larger">
    Click
    <b> <a href="http://${hostLocation}/password/${uuid}">here</a> </b>
    to reset your password.
  </p>
  <h1 style="align-items:center;height:80px;display:flex;">
    <img src="http://pokerface.io/images/logo.png" style="height: inherit; "/>
    <div style="text-align: center;padding-left: .75rem; color: black;">
      <div style="font-size: xx-large;">Pokerface.io
        <div style="font-size: medium; font-weight: normal; ">Social platform for Poker players</div>
      </div>
    </div>
  </h1>
  `
  const message = Object.assign({}, generalSignupMessage, {to:email, attachment:[{data:htmlContent, alternative:true}]})

  return sendMessage(email, message)
}

export default {
  sendSignupMessage,
  sendResetPasswordMessage,
  sendEventInvite(event, inviteds){
    return getSendableInviteds(inviteds).then(players=>{
      return Promise.all(players.map(player=>sendPersonalEventInvite(event.owner, event, player)))
    })
  },
  sendEventCancelled(event, inviteds){
    return getSendableInviteds(inviteds).then(players=>{
      return Promise.all(players.map(player=>sendPersonalEventCancellation(event.owner, event, player)))
    })
  },
  sendEventUpadte(event, inviteds){
    return getSendableInviteds(inviteds).then(players=>{
      return Promise.all(players.map(player=>sendPersonalEventUpdate(event.owner, event, player)))
    })
  },
}
