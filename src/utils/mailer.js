import emailjs from 'emailjs'
import icalToolkit from 'ical-toolkit'

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

  return Db.models.Player.find({
    _id: {
      $in: [...invitedUsers, game.player],
    },
  }).then(players=>{
    const orgenizer = players.filter(player=>player.username===game.player)[0]

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

export default {
  sendSignupMessage(firstname, lastname, email){
    const htmlContent = `<h3>Sorry ${firstname} ${lastname},</h3>
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
