import express from 'express'
import jdenticon from 'jdenticon'
import path from 'path'
const router = express.Router()

router.get('/avatarGenerator', (req, res)=>{
  const {username} = req.query
  if (username){
    res.setHeader('Content-Type','image/png')
    res.send(jdenticon.toPng(username, 200))
  }else{
    res.sendFile(path.join(__dirname,'general-avatar.png'))
  }
})

export default router
