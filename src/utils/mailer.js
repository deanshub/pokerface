import emailjs from 'emailjs'
import icalToolkit from 'ical-toolkit'
import config from 'config'

const hostLocation = (config.NODE_ENV==='development')?
    `localhost:${config.PORT}`
  :
    'pokerface.io'

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

const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

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

function sendPersonalGameInvite(organizer, game, player){
  const email = player.email
  const newPlayer = player.new

  return new Promise((resolve,reject)=>{
    const generalInviteMessage = {
      from: '"Pokerface.io" <support@pokerface.io>', // sender address
      subject: game.title||'Game Invitation', // Subject line
    }
    const htmlContent = `<div>${organizer.fullname} invited you to a game.</div>
    <br/>
    <div>${game.description||''}</div>
    <br/><br/>
    <div>${newPlayer?'You are not a registered user, if you wish to RSVP please signup at <a href="http://pokerface.io/login">Pokerface.io</a>':'Please RSVP at <a href="http://pokerface.io/events">Pokerface.io</a>'}</div>
    <br/><br/><br/>
    <small>For more information checkout <a href="http://pokerface.io/events">Pokerface.io</a></small>`

    const ics = generateIcs(game)

    const message = Object.assign({}, generalInviteMessage, {to:email, attachment:[{data:htmlContent, alternative:true}, {data:ics.toString(), type:'application/ics', name:'pokerface.ics', method:'REQUEST'}]})

    server.send(message, (error, message) => {
      if (error) {
        reject(error)
      }else{
        resolve({email,sucess:1})
      }
    })
  }).catch(err=>{
    console.error(err)
    return {email, sucess:0}
  })
}

function sendPersonalGameCancellation(organizer, game, player){
  const email = player.email
  const newPlayer = player.new

  return new Promise((resolve,reject)=>{
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

    server.send(message, (error, message) => {
      if (error) {
        reject(error)
      }else{
        resolve({email,sucess:1})
      }
    })
  }).catch(err=>{
    console.error(err)
    return {email, sucess:0}
  })
}

function getAllPlayers(game, Db){
  const invitedUsers = game.invited.filter(player=>!player.guest).map(player=>player.username)
  const invitedGuests = game.invited.filter(player=>player.guest)

  return Db.models.User.find({
    _id: {
      $in: [...invitedUsers, game.owner],
    },
  }).then(players=>{
    const orgenizer = players.filter(player=>player.username===game.owner)[0]

    const additionalPlayers = invitedGuests.filter(player=>emailRegex.test(player.fullname)).map(player=>{
      return {
        email: player.fullname,
        new: true,
      }
    })

    const registeredPlayersEmails = players.map(player=>player.email)
    const additionalPlayersEmails = additionalPlayers.filter(newPlayer=>!registeredPlayersEmails.includes(newPlayer.email))
    return {players:players.concat(additionalPlayersEmails), orgenizer}
  })
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
}


export default {
  sendSignupMessage,
  sendResetPasswordMessage,
  sendGameInvite(game, Db){
    return getAllPlayers(game, Db).then(({players,orgenizer})=>{
      return Promise.all(players.map(player=>sendPersonalGameInvite(orgenizer, game, player)))
    })
  },
  sendGameCancelled(game, Db){
    return getAllPlayers(game, Db).then(({players,orgenizer})=>{
      return Promise.all(players.map(player=>sendPersonalGameCancellation(orgenizer, game, player)))
    })
  },
}
