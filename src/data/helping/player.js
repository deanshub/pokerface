import DB from '../db'

export const createPlayer = (player) => {
  const {
    firstname,
    lastname,
  } = player

  return DB.models.Player.find({
    firstname: {$regex: firstname, $options: 'i'},
    lastname:{$regex: lastname, $options: 'i'},
  }).count().then((count) => {
    const username = `${firstname}.${lastname}.${count+1}`.toLowerCase().replace(/ /g,'.')

    const newPlayer = {
      _id: username,
      ...player,
    }

    return new DB.models.Player(newPlayer).save()
  })
}
