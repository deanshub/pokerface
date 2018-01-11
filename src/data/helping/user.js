import DB from '../db'
import {LOGIN, REBRANDING} from '../../utils/permissions'

export const createUser = (user) => {
  const {
    firstname,
    lastname,
  } = user

  const where = {firstname: {$regex: firstname, $options: 'i'}}
  let fullname

  if (!lastname){
    fullname = firstname
  }else{
    where.lastname = {$regex: lastname, $options: 'i'}
    fullname = `${firstname}.${lastname}`
  }

  return DB.models.User.find(where).count().then((count) => {
    const username = `${fullname}.${count+1}`.toLowerCase().replace(/ /g,'.')

    const newUser = {
      _id: username,
      ...user,
    }

    return new DB.models.User(newUser).save()
  })
}

export const findPopulatedUser = (where) => {
  return DB.models.User.findOne(where).populate([
    {path:'players', select:'username fullanme email avatar'},
  ])
}

export const findPopulatedUserById = (id) => {
  return DB.models.User.findById(id).populate([
    {path:'players', select:'username fullanme email avatar'},
  ])
}

// return find player with organizations count
export const findPlayerWithOrganizations = (where) => {
  return DB.models.User.findOne(where).then((user) => {
    if (!user){
      return false
    }else{
      const player = user.toJSON()
      return loginPermissionFilter(DB.models.User.find({players:player.id})).count().then((count) =>{
        player.organizations = count
        return player
      })
    }
  })
}

// return find player with organizations count
export const findPlayerWithOrganizationsById = (id) => {
  return DB.models.User.findById(id).then((user) => {
    if (!user){
      return false
    }else{
      const player = user.toJSON()
      return loginPermissionFilter(DB.models.User.find({players:player.id})).count().then((count) =>{
        player.organizations = count
        return player
      })
    }
  })
}

export const prepareAvatar = (user) => {
  const {avatar, username} = user

  if (!avatar){
    return '/images/avatar.png'
  }else if (!avatar){
    return `/api/avatarGenerator?username=${username}`
  }else if (!avatar.startsWith('http')) {
    return `/images/${avatar}`
  }

  return avatar
}

export const prepareCoverImage = (user) => {
  const {coverImage, username} = user

  if (!coverImage){
    return `/api/avatarGenerator?username=${username}`
  }else if (!coverImage.startsWith('http')) {
    return `/images/${coverImage}`
  }

  return coverImage
}

export const prepareEventCoverImage = (event) => {
  const coverImage = event.image

  if (!coverImage){
    return `/api/avatarGenerator?username=${event.title}`
  }else if (!coverImage.startsWith('http')) {
    return `/images/${coverImage}`
  }

  return coverImage
}

export const prepareGeneralImage = (image) => {

  return image?`/images/${image}`:undefined
}

export const prepareRebrandingDetails = (permissions, rebrandingDetails={}) =>{
  if (!permissions.includes(REBRANDING)){
    return null
  }else{
    return {...rebrandingDetails, logo:prepareGeneralImage(rebrandingDetails.logo)}
  }
}


// Organization
export const loginPermissionFilter = (query) => {
  return query.where({permissions:LOGIN})
}
