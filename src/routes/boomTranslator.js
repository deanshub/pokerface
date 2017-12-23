import express from 'express'
import request from 'request'
import {parseString} from 'xml2js'
import boomPlayerObjToSpot from '../utils/transformBoom'

const router = express.Router()
const boomPlayerXmlRegex = /https:\/\/www\.boomplayer\.com\/repository\/pCode\/[^.]+\.xml/i

const requestPromise = (url)=> new Promise((resolve, reject)=>{
  request.get(url,(err,resp,body)=>{
    if (err) {
      reject(err)
    }else{
      resolve(body)
    }
  })
})

const parseXmlString = (xml)=> new Promise((resolve, reject)=>{
  parseString(xml, {trim:true, attrkey:'@', explicitRoot:false, mergeAttrs:true, explicitArray:false, preserveChildrenOrder:true}, function (err, result) {
    if (err){
      reject(err)
    }else{
      resolve(result)
    }
  })
})

router.get('/boomTranslator', (req, res)=>{
  const {id} = req.query
  requestPromise(`http://www.boomplayer.com/html5/poker-hands/Boom/${id}`).then((body)=>{
    const results = boomPlayerXmlRegex.exec(body)
    if (results){
      return requestPromise(results[0])
    }else{
      throw new Error(`Can't find boom player hand ${id}`)
    }
  }).then((xml)=>{
    return parseXmlString(xml)
  }).then((boomSpot)=>{
    const spot = boomPlayerObjToSpot(boomSpot)
    res.json(spot)
  }).catch(err=>{
    console.error(err);
    res.status(404).json({error:err})
  })
})

export default router
