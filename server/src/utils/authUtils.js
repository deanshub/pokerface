import Db from '../data/db'
import jwt  from 'jsonwebtoken'
import config from 'config'
import CryptoJS from 'crypto-js'

export const isSuperAdmin = (user) => {
  return user.username === 'deanshub'
}

export const getUserByToken = (token) => {
  if(token === null){
    console.error('empty token')
    return Promise.resolve({})
  }

  const {username, password} = jwt.verify(token, config.JWT_SECRET_KEY)
  return Db.models.User.findById(username).then((user)=>{
    if (user && user.password !== password){
      return {}
    }

    return {...user.toJSON()}
  })
}

export const signTokenToUser = (user) => {
  // TODO may check _id !== null or change the sign attribute
  if (user){
    const {username, password} = user
    return jwt.sign({username, password}, config.JWT_SECRET_KEY)
  }
}

export const encryptUsername = (username) => {
  return CryptoJS.AES.encrypt(username, config.JWT_SECRET_KEY)
}

export const decryptUsername = (userKey) => {
  const bytes = CryptoJS.AES.decrypt(userKey, config.JWT_SECRET_KEY)
  return bytes.toString(CryptoJS.enc.Utf8)
}
