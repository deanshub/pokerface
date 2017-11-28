import Db from '../data/db'
import jwt  from 'jsonwebtoken'
import config from 'config'

export const isSuperAdmin = (user) => {
  return user.username === 'deanshub'
}

export const getUserByToken = (token) => {
  if(token === null){
    console.error('empty token')
    return Promise.resolve({})
  }

  const {username, password} = jwt.verify(token, config.SECRET_KEY)
  return Db.models.Player.findById(username).then((user)=>{
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
    return jwt.sign({username, password}, config.SECRET_KEY)
  }
}
