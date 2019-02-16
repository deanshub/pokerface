import config from 'config'
import express from 'express'
import puppeteer from 'puppeteer'
import path from 'path'
import fs from 'fs'

const router = express.Router()

router.get('/spotGif', (req, res)=>{
  const {id} = req.query
  if (id){
    const gifPath = path.join(__dirname,`../../../client/static/images/spots/${id}.gif`)
    // check if image exists for this spot
    //  if so send it
    // run puppeteer go to the standalone post url
    // run the clientside export gif
    // save the file with the correct name in the correct directory
    if (fs.existsSync(gifPath)){
      res.sendFile(gifPath)
    }else{
      const headless = true
      // const headless = config.NODE_ENV!=='development'
      let outerBrowser
      puppeteer.launch({ignoreHTTPSErrors: true, headless})
        .then(browser=>{
          outerBrowser = browser
          return browser.newPage().then(page=>{
            return {browser, page}
          })
        }).then(({browser, page})=>{
          return page._client.send('Page.setDownloadBehavior', { behavior: 'allow', downloadPath: path.dirname(gifPath) }).then(()=>({browser, page}))
        }).then(({browser, page})=>{
          return page.setViewport({
            width: 1000,
            height: 1080,
          }).then(()=>({browser, page}))
        }).then(({browser, page})=>{
          return page.goto(config.NODE_ENV!=='development'?`https://pokerface.io/post/${id}`:`https://localhost:8443/post/${id}`).then(()=>({browser, page}))
        }).then(({browser, page})=>{
          return page.waitFor('div[class*="share"]').then(()=>({browser, page}))
        }).then(({browser, page})=>{
          return page.click('div[class*="share"]')
            .then(()=>{
              return page.evaluate(()=>{
                return document.querySelector('[name="downloadGif"]').style.display=''
              })
            })
            .then(()=>{
              return page.click('[name="downloadGif"]')
            })
            .then(()=>({browser, page}))
        }).then(({browser, page})=>{
          return page.waitFor('div[class*="overlay"]',{hidden:true, timeout: 120000}).then(()=>({browser, page}))
        }).then(({browser, page})=>{
          return page.waitFor(100).then(()=>({browser, page}))
        }).then(({browser})=>{
          return browser.close()
        }).then(()=>{
          res.sendFile(gifPath)
        }).catch(e=>{
          console.error(e)
          res.status(400).json({error:e})
          if (outerBrowser && outerBrowser.close){
            try{
              outerBrowser.close()
            }catch(e){
              console.error(e)
            }
          }
        })
    }
  }else{
    res.status(404).json({error:'Spot not found'})
  }
})

export default router
