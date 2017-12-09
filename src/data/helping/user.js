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
    {path:'organizations'},
    {path:'players'},
  ])
}

export const findPopulatedUserById = (id) => {
  return DB.models.User.findById(id).populate([
    {path:'organizations', select:'firstname avatar'},
    {path:'players'},
  ])
}
