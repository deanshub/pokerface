import path from 'path'
import express from 'express'
// import fs from 'fs'
// import ReactDOMServer from 'react-dom/server'

const STATIC_FILES_DIRECTORY = path.join(__dirname,'../../../client/static')
const INDEX_HTML_PATH = path.join(STATIC_FILES_DIRECTORY, 'index.html')

function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()){
    return next()
  }

  if (req.originalUrl.trim()!=='/'){
    res.redirect(`/login?url=${req.originalUrl}`)
  }else {
    res.redirect('/login')
  }
}

const router = express.Router()
router.use('/profile', isAuthenticated, express.static(INDEX_HTML_PATH))
router.use('/timer', isAuthenticated, express.static(INDEX_HTML_PATH))
router.use('/smart', isAuthenticated, express.static(INDEX_HTML_PATH))
router.use('/profile/:username', isAuthenticated,express.static(INDEX_HTML_PATH))
router.use('/events', isAuthenticated,express.static(INDEX_HTML_PATH))
router.use('/login', express.static(INDEX_HTML_PATH))
router.use('/post/:id', express.static(INDEX_HTML_PATH))
// router.get('/post/:id', function (req, res) {
//   // and drop 'public' in the middle of here
//   res.sendFile(path.join(STATIC_FILES_DIRECTORY, 'index.html'))
//   fs.readFile('./index.html', 'utf8', function (err, file) {
//     if (err) {
//       return console.error(err)
//     }
//     const document = file.replace(/<div id="app"><\/div>/, `<div id="app">${html}</div>`)
//     res.send(document)
//   })
// })
// router.use('/', isAuthenticated, express.static(INDEX_HTML_PATH))


router.use('/', express.static(STATIC_FILES_DIRECTORY))


// router.get('*', function (req, res) {
//   // and drop 'public' in the middle of here
//   res.sendFile(path.join(STATIC_FILES_DIRECTORY, 'index.html'))
// })


export default router
