import path from 'path'
import express from 'express'

const STATIC_FILES_DIRECTORY = path.join(__dirname,'../../../client/static')
const INDEX_HTML_PATH = path.join(STATIC_FILES_DIRECTORY, 'index.html')

function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()){
    return next()
  }
  res.redirect(`/login?url=${req.originalUrl}`)
}

const router = express.Router()
router.use('/profile', isAuthenticated, express.static(INDEX_HTML_PATH))
router.use('/timer', isAuthenticated, express.static(INDEX_HTML_PATH))
router.use('/smart', isAuthenticated, express.static(INDEX_HTML_PATH))
router.use('/profile/:username', isAuthenticated,express.static(INDEX_HTML_PATH))
router.use('/events', isAuthenticated,express.static(INDEX_HTML_PATH))
router.use('/login', express.static(INDEX_HTML_PATH))
// router.use('/', isAuthenticated, express.static(INDEX_HTML_PATH))


router.use('/', express.static(STATIC_FILES_DIRECTORY))


// app.get('*', function (req, res) {
//   // and drop 'public' in the middle of here
//   res.sendFile(path.join(STATIC_FILES_DIRECTORY, 'index.html'))
// })


export default router
