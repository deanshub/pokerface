import Db from '../data/db'
import jwt  from 'jsonwebtoken'

const isSuperAdmin = (user) => {
  return user._id === 'deanshub'
}

const getUserByToken = (token) => {
  if(token == null){
    return {}
  }

  const payload = jwt.verify(token, SECRET_KEY)
  return Db.models.Player.findById(payload.id).select('-password').then((user)=>{
    return {...user.toJSON(), fullname:user.fullname}
  })
}

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


const getTokenFromCookieString = (cookieString) => {
  return getCookieByName(cookieString, 'jwt')
}

const SECRET_KEY = 'pa pa pokerface'
const COOKIE_TOKEN_NAME = 'jwt'

export {
  getUserByToken,
  isSuperAdmin,
  getTokenFromCookieString,
  SECRET_KEY,
  COOKIE_TOKEN_NAME,
}
