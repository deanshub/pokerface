import Db from '../data/db'
import jwt  from 'jsonwebtoken'
import config from 'config'

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
