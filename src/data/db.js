import Sequelize from 'sequelize'
import faker from 'faker'
import CreatePlayerModel from './dbModels/Player'
import CreatePostModel from './dbModels/Post'

const Conn = new Sequelize(
  'pokerface',
  process.env.POSTGRES_USER,
  process.env.POSTGRES_PASSWORD,
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
  function generateRandomArray(num){
    return Array.from(Array(Math.floor(Math.random()*num)))
  }

  faker.seed(123)
  Array.from(Array(10)).forEach(()=>{
    return Player.create({
      username: faker.internet.userName(),
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      email: faker.internet.email(),
      avatar: faker.image.avatar(),
      coverImage: faker.image.image(),
    }).then(player=>{
      return Promise.all(generateRandomArray(7).map(()=>{
        return player.createPost({
          content: faker.lorem.paragraph(),
          photos: generateRandomArray(5).map(()=>faker.random.image()),
          likes: faker.random.number(),
        })
      }))
    })
  })
})


export default Conn
