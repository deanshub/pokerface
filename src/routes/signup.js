import express from 'express'
import emailjs from 'emailjs'
const router = express.Router()

// create reusable transporter object using the default SMTP transport
const server = emailjs.server.connect({
  user: process.env.GMAIL_USER,
  password: process.env.GMAIL_PASSWORD,
  host: 'smtp.gmail.com',
  ssl: true,
})
// setup email data with unicode symbols
const generalMessage = {
  from: '"Pokerface.io" <support@pokerface.io>', // sender address
  // to: 'bar@blurdybloop.com, baz@blurdybloop.com', // list of receivers
  subject: 'Pokerface.io Signup ✔', // Subject line
  // bcc: 'support@pokerface.io',
  bcc: 'dean@shubapp.com',
  // text: 'Hello world ?', // plain text body
  // html: '<b>Hello world ?</b>' // html body
}


router.post('/signup', (req, res)=>{
  const {firstName, lastName, email} = req.body

  const htmlContent = `<h3>Sorry ${firstName} ${lastName},</h3>
  <h4>Currently signup is via invitations only ☹</h4>
  <div>But don't worry, we added you to the waiting list,<br/>we will send you an invite as soon as we open pokerface.io to the public.</div>
  <br/>
  <div>Thank you for signing up and have a good day!</div>
  `
  const message = Object.assign({}, generalMessage, {to:email, attachment:[{data:htmlContent, alternative:true}]})

  // send mail with defined transport object
  server.send(message, (error, message) => {
    if (error) {
      console.log(error)
      res.json({error})
    }else{
      console.log('Message %s sent', message)
      res.json({sucess:true})
    }
  })
})

export default router
