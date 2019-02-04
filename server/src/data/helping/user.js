import DB from '../db'
import config from 'config'
import {LOGIN, REBRANDING} from '../../utils/permissions'

export const createUser = (user) => {
  const {
    firstname,
    lastname,
  } = user

  let regexUsername   //{firstname: {$regex: firstname, $options: 'i'}}

  if (!lastname){
    regexUsername = firstname.trim().toLowerCase().replace(/ /g,'.')
  }else{
    regexUsername = `${firstname.trim()} ${lastname.trim()}`.toLowerCase().replace(/ /g,'.')
  }

  return DB.models.User.find({_id: {$regex: regexUsername}}).then(users => {

    //find the max index
    const seqNumbers = users.map(user => {
      const splitted = user.username.split('.')
      const seqNumber = splitted[splitted.length-1]
      return isNaN(seqNumber)?1:parseInt(seqNumber)
    })

    const nextSeq = Math.max(...seqNumbers, seqNumbers.length)+1
    const username = `${regexUsername}.${nextSeq}`

    const newUser = {
      _id: username,
      ...user,
    }

    return new DB.models.User(newUser).save()
  })
}

export const findPopulatedUser = (where) => {
  return DB.models.User.findOne(where).populate([
    {path:'players', select:'username fullname email avatar'},
  ])
}

export const findPopulatedUserById = (id) => {
  return DB.models.User.findById(id).populate([
    {path:'players', select:'username fullname email avatar'},
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
    return `${config.ROOT_URL}/images/avatar.png`
  }else if (!avatar){
    return `${config.ROOT_URL}/api/avatarGenerator?username=${username}`
  }else if (!avatar.startsWith('http')) {
    return `${config.ROOT_URL}/images/${avatar}`
  }

  return avatar
}

export const prepareCoverImage = (coverImage) => {
  if (coverImage && !coverImage.startsWith('http')) {
    return `${config.ROOT_URL}/images/${coverImage}`
  }

  return coverImage
}

export const prepareGeneralImage = (image) => {

  return image?`${config.ROOT_URL}/images/${image}`:undefined
}

export const prepareRebrandingDetails = (permissions, rebrandingDetails={},avatar, fullname) =>{
  if (!permissions || !permissions.includes(REBRANDING)){
    return null
  }else{
    return {...rebrandingDetails, logo:prepareGeneralImage(rebrandingDetails.logo||avatar), title:rebrandingDetails.title||fullname}
  }
}


// Organization
export const loginPermissionFilter = (query) => {
  return query.where({permissions:LOGIN})
}
