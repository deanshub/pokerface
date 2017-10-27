import path from 'path'
import express from 'express'
import fs from 'fs'
import DB from '../data/db'
// import ReactDOMServer from 'react-dom/server'

const STATIC_FILES_DIRECTORY = path.join(__dirname,'../../../client/static')
const INDEX_HTML_PATH = path.join(STATIC_FILES_DIRECTORY, 'index.html')
const metaFbUrl = '<meta property="og:url" content="http://pokerface.io"/>'
const metaFbTitle = '<meta property="og:title" content="Welcome to Pokerface.io"/>'
const metaFbImage = '<meta property="og:image" content="http://pokerface.io/images/fav2.jpg"/>'

function isAuthenticated(req, res, next) {
  if (!req.user) {
    if (req.originalUrl.trim()!=='/'){
      res.redirect(`/login?url=${req.originalUrl}`)
    }else {
      res.redirect('/login')
    }
  }else{
    return next()
  }
}

function sendDocument(req, res, post) {
  const postUrl = `${req.protocol}://${req.get('Host')}${req.url}`
  let photosMetaFbImages = []
  if (post){
    photosMetaFbImages = post.photos.map(photo=>{
      return `<meta property="og:image" content="${req.protocol}://${req.get('Host')}/images/${photo}"/>`
    })
  }

  fs.readFile(INDEX_HTML_PATH, 'utf8', function (err, file) {
    if (err) {
      return console.error(err)
    }
    const document = file.replace(metaFbUrl, `<meta property="og:url" content="${postUrl}"/>`)
    .replace(metaFbTitle, '<meta property="og:title" content="New post shared in Pokerface.io"/>')
    .replace(metaFbImage, [...photosMetaFbImages,metaFbImage].join(''))
    res.send(document)
  })
}

const router = express.Router()
router.use('/profile', isAuthenticated, express.static(INDEX_HTML_PATH))
router.use('/timer', isAuthenticated, express.static(INDEX_HTML_PATH))
router.use('/smart', isAuthenticated, express.static(INDEX_HTML_PATH))
router.use('/profile/:username', isAuthenticated, express.static(INDEX_HTML_PATH))
router.use('/events', isAuthenticated, express.static(INDEX_HTML_PATH))
router.use('/login', express.static(INDEX_HTML_PATH))
router.get('/post/:id', function (req, res) {


  DB.models.Post.findById(req.params.id).then(post=>{
    sendDocument(req, res, post)
  }).catch((err)=>{
    console.error(err)
    sendDocument(req, res)
  })
})


router.use('/', express.static(STATIC_FILES_DIRECTORY))


export default router
