import Db from '../data/db'
import jwt  from 'jsonwebtoken'
import config from 'config'

const getCookieValues = (cookie) => {
  const cookieArray = cookie.split('=')
  const cookieValue = cookieArray[1]
  if (typeof cookieValue==='string'){
    return cookieValue.trim()
  }else{
    return undefined
  }
}
const getCookieNames = (cookie) => {
  const cookieArray = cookie.split('=')
  return cookieArray[0].trim()
}

const getCookieByName = (cookieString, name) => {
  if (cookieString === undefined){
    return null
  }
  const cookies = cookieString.split(';')

  if (!Array.isArray(cookies)){
    return null
  }

  const cookieValue = cookies.map(getCookieValues)[cookies.map(getCookieNames).indexOf(name)]

  return (cookieValue === undefined) ? null : cookieValue
}

export const isSuperAdmin = (user) => {
  return user._id === 'deanshub'
}

export const getUserByToken = (token) => {
  if(token === null){
    console.error('empty token')
    return Promise.resolve({})
  }

  const payload = jwt.verify(token, config.SECRET_KEY)
  return Db.models.Player.findById(payload.id).select('-password').then((user)=>{
    return {...user.toJSON(), fullname:user.fullname}
  })
}

export const getTokenFromCookieString = (cookieString) => {
  return getCookieByName(cookieString, COOKIE_TOKEN_NAME)
}

export const COOKIE_TOKEN_NAME = 'jwt'
