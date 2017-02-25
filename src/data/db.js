import Sequelize from 'sequelize'
import faker from 'faker'
import CreatePlayerModel from './dbModels/Player'
import CreatePostModel from './dbModels/Post'

const Conn = new Sequelize(
  'pokerface',
  'postgres',
  'admin',
  {
    dialect: 'postgres',
    host: 'localhost',
  }
)

const Player = CreatePlayerModel(Conn)
const Post = CreatePostModel(Conn)

Post.belongsTo(Player)
Player.hasMany(Post)


Conn.sync({force: true}).then(()=>{
  // TODO: only in debug
  faker.seed(123)
  Array.from(Array(10)).forEach(()=>{
    return Player.create({
      username: faker.internet.userName(),
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      email: faker.internet.email(),
    }).then(player=>{
      return player.createPost({
        content: faker.lorem.paragraph(),
      })
    })
  })
})


export default Conn
