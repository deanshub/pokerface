import Db from '../data/db'
import jwt  from 'jsonwebtoken'
import config from 'config'

const getCookieByName = (cookieString, name) => {
  const getCookieValues = (cookie) => {
    const cookieArray = cookie.split('=')
    return cookieArray[1].trim()
  }

  const getCookieNames = (cookie) => {
    const cookieArray = cookie.split('=')
    return cookieArray[0].trim()
  }

  if (cookieString == undefined){
    return null
  }
  const cookies = cookieString.split(';')

  if (cookies == ''){
    return null
  }

  const cookieValue = cookies.map(getCookieValues)[cookies.map(getCookieNames).indexOf(name)]

  return (cookieValue === undefined) ? null : cookieValue
}

export const isSuperAdmin = (user) => {
  return user._id === 'deanshub'
}

export const getUserByToken = (token) => {
  return new Promise((resolve)=>{
    if(token == null){
      return resolve({})
    }

    const payload = jwt.verify(token, config.SECRET_KEY)
    return Db.models.Player.findById(payload.id).select('-password').then((user)=>{
      return {...user.toJSON(), fullname:user.fullname}
    })
  })
}

export const getTokenFromCookieString = (cookieString) => {
  return getCookieByName(cookieString, 'jwt')
}

export const COOKIE_TOKEN_NAME = 'jwt'
