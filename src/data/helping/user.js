import DB from '../db'

export const createUser = (user) => {
  const {
    firstname,
    lastname,
  } = user

  return DB.models.User.find({
    firstname: {$regex: firstname, $options: 'i'},
    lastname:{$regex: lastname, $options: 'i'},
  }).count().then((count) => {
    const username = `${firstname}.${lastname}.${count+1}`.toLowerCase().replace(/ /g,'.')

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
      return DB.models.User.count({players:player.id}).then((count) =>{
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
      return DB.models.User.count({players:player.id}).then((count) =>{
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
  }else if (!avatar.includes('http')) {
    return `/images/${avatar}`
  }

  return avatar
}

export const prepareCoverImage = (user) => {
  const {coverImage, username} = user

  if (!coverImage){
    return '/images/cover.jpg'
  }else if (!coverImage){
    return `/api/avatarGenerator?username=${username}`
  }else if (!coverImage.includes('http')) {
    return `/images/${coverImage}`
  }

  return coverImage
}
